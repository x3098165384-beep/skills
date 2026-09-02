[CmdletBinding()]
param(
    [string]$RepositoryRoot = (Split-Path -Parent $PSScriptRoot),
    [string]$BackupRoot
)

$ErrorActionPreference = 'Stop'

$repositoryPath = [System.IO.Path]::GetFullPath($RepositoryRoot)
$skillsPath = [System.IO.Path]::GetFullPath((Join-Path $repositoryPath 'skills'))

if (-not (Test-Path -LiteralPath $skillsPath -PathType Container)) {
    throw "Skills directory not found: $skillsPath"
}

$skillSources = @{}
$skillFiles = Get-ChildItem -LiteralPath $skillsPath -Filter 'SKILL.md' -Recurse |
    Where-Object { $_.FullName -notmatch '[\\/]deprecated[\\/]' }

foreach ($skillFile in $skillFiles) {
    $skillName = $skillFile.Directory.Name
    if ($skillSources.ContainsKey($skillName)) {
        throw "Duplicate skill name: $skillName"
    }

    $sourcePath = [System.IO.Path]::GetFullPath($skillFile.Directory.FullName)
    if (-not $sourcePath.StartsWith(
            $skillsPath + [System.IO.Path]::DirectorySeparatorChar,
            [System.StringComparison]::OrdinalIgnoreCase
        )) {
        throw "Skill source escaped the repository skills directory: $sourcePath"
    }

    $skillText = [System.IO.File]::ReadAllText($skillFile.FullName)
    if ($skillText -match '(?m)^disable-model-invocation:\s*true\s*$') {
        throw "Codex-incompatible disable-model-invocation field: $($skillFile.FullName)"
    }
    if ($skillText -match '(?m)^argument-hint:') {
        throw "Unsupported Codex argument-hint field: $($skillFile.FullName)"
    }

    $openAiConfigPath = Join-Path $sourcePath 'agents\openai.yaml'
    if (Test-Path -LiteralPath $openAiConfigPath -PathType Leaf) {
        $openAiConfig = [System.IO.File]::ReadAllText($openAiConfigPath)
        if ($openAiConfig -match 'allow_implicit_invocation:\s*false') {
            throw "Explicit-only skills can be misreported as unavailable by Codex: $openAiConfigPath"
        }
    }

    $skillSources[$skillName] = $sourcePath
}

if (-not $BackupRoot) {
    $workspacePath = Split-Path -Parent $repositoryPath
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $BackupRoot = Join-Path $workspacePath "skill-backups\mattpocock-before-codex-$timestamp"
}

$backupPath = [System.IO.Path]::GetFullPath($BackupRoot)
if ($backupPath.StartsWith(
        $repositoryPath + [System.IO.Path]::DirectorySeparatorChar,
        [System.StringComparison]::OrdinalIgnoreCase
    )) {
    throw "Backup directory must be outside the repository: $backupPath"
}

$userProfilePath = [Environment]::GetFolderPath('UserProfile')
$destinations = @(
    @{ Root = (Join-Path $userProfilePath '.agents\skills'); Label = 'dot-agents' },
    @{ Root = (Join-Path $userProfilePath '.codex\skills'); Label = 'dot-codex' }
)

New-Item -ItemType Directory -Path $backupPath | Out-Null

$movedEntries = [System.Collections.Generic.List[object]]::new()
$createdJunctions = [System.Collections.Generic.List[string]]::new()
$activeLinkCount = 0

try {
    foreach ($destination in $destinations) {
        $destinationRoot = [System.IO.Path]::GetFullPath($destination.Root)
        New-Item -ItemType Directory -Force -Path $destinationRoot | Out-Null

        $destinationBackup = Join-Path $backupPath $destination.Label
        New-Item -ItemType Directory -Path $destinationBackup | Out-Null

        foreach ($skillName in ($skillSources.Keys | Sort-Object)) {
            $sourcePath = $skillSources[$skillName]
            $targetPath = [System.IO.Path]::GetFullPath(
                (Join-Path $destinationRoot $skillName)
            )

            if (-not $targetPath.StartsWith(
                    $destinationRoot + [System.IO.Path]::DirectorySeparatorChar,
                    [System.StringComparison]::OrdinalIgnoreCase
                )) {
                throw "Skill target escaped its destination root: $targetPath"
            }

            if (Test-Path -LiteralPath $targetPath) {
                $existingItem = Get-Item -LiteralPath $targetPath -Force
                $existingTarget = if ($existingItem.Target) {
                    [System.IO.Path]::GetFullPath([string]$existingItem.Target)
                } else {
                    ''
                }

                if ($existingItem.LinkType -eq 'Junction' -and
                    $existingTarget -eq $sourcePath) {
                    $activeLinkCount++
                    continue
                }

                $entryBackup = Join-Path $destinationBackup $skillName
                Move-Item -LiteralPath $targetPath -Destination $entryBackup
                $movedEntries.Add([pscustomobject]@{
                    Original = $targetPath
                    Backup = $entryBackup
                })
            }

            New-Item -ItemType Junction -Path $targetPath -Target $sourcePath |
                Out-Null
            $createdJunctions.Add($targetPath)
            $activeLinkCount++
        }
    }
} catch {
    foreach ($junctionPath in $createdJunctions) {
        if (Test-Path -LiteralPath $junctionPath) {
            Remove-Item -LiteralPath $junctionPath -Force
        }
    }

    foreach ($entry in $movedEntries) {
        if (Test-Path -LiteralPath $entry.Backup) {
            Move-Item -LiteralPath $entry.Backup -Destination $entry.Original
        }
    }

    throw
}

Write-Output "Skills discovered: $($skillSources.Count)"
Write-Output "Skill links active: $activeLinkCount"
Write-Output "New junctions created: $($createdJunctions.Count)"
Write-Output "Previous entries backed up: $($movedEntries.Count)"
Write-Output "Backup: $backupPath"
