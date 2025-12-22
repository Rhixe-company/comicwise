# PowerShell completion for cw CLI

Register-ArgumentCompleter -Native -CommandName cw -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)

    $commands = @('scaffold', 'health', 'cache', 'queue', 'upload', 'db', 'ci')
    $scaffoldTemplates = @('component', 'page', 'action', 'api')
    $cacheActions = @('clear', 'stats', 'flush')
    $queueActions = @('start', 'stop', 'status')
    $uploadProviders = @('cloudinary', 's3', 'imagekit', 'local')
    $dbActions = @('migrate', 'seed', 'reset', 'studio')
    $ciActions = @('test', 'build', 'check', 'deploy')

    $tokens = $commandAst.ToString().Split(' ')
    
    if ($tokens.Count -eq 1) {
        # Complete main commands
        $commands | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
        }
    }
    elseif ($tokens.Count -eq 2) {
        # Complete subcommands
        switch ($tokens[1]) {
            'scaffold' { 
                $scaffoldTemplates | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
                }
            }
            'cache' { 
                $cacheActions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
                }
            }
            'queue' { 
                $queueActions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
                }
            }
            'upload' { 
                $uploadProviders | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
                }
            }
            'db' { 
                $dbActions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
                }
            }
            'ci' { 
                $ciActions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
                }
            }
        }
    }
}
