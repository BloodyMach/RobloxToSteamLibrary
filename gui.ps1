param (
    [string]$ExecutablePath = "node.exe"
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ... rest of script ...

# Create Form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Roblox to Steam Shortcut"
$form.Size = New-Object System.Drawing.Size(600, 450)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false

# Label
$label = New-Object System.Windows.Forms.Label
$label.Text = "Roblox Game URL:"
$label.Location = New-Object System.Drawing.Point(20, 20)
$label.Size = New-Object System.Drawing.Size(540, 20)
$form.Controls.Add($label)

# Input Box
$urlInput = New-Object System.Windows.Forms.TextBox
$urlInput.Location = New-Object System.Drawing.Point(20, 45)
$urlInput.Size = New-Object System.Drawing.Size(440, 25)
$form.Controls.Add($urlInput)

# Button
$addButton = New-Object System.Windows.Forms.Button
$addButton.Text = "Add to Steam"
$addButton.Location = New-Object System.Drawing.Point(470, 44)
$addButton.Size = New-Object System.Drawing.Size(90, 25)
$form.Controls.Add($addButton)

# Log Box
$logBox = New-Object System.Windows.Forms.TextBox
$logBox.Location = New-Object System.Drawing.Point(20, 90)
$logBox.Size = New-Object System.Drawing.Size(540, 300)
$logBox.Multiline = $true
$logBox.ScrollBars = "Vertical"
$logBox.ReadOnly = $true
$logBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$logBox.BackColor = [System.Drawing.Color]::Black
$logBox.ForeColor = [System.Drawing.Color]::LightGreen
$form.Controls.Add($logBox)

# Button Click Event
$addButton.Add_Click({
        $url = $urlInput.Text
        if ([string]::IsNullOrWhiteSpace($url)) {
            $logBox.AppendText("Please enter a Roblox Game URL.`r`n")
            return
        }
        
        $addButton.Enabled = $false
        $logBox.AppendText("Processing... Please wait.`r`n")
        $form.Refresh() # Force UI update

        try {
            $pinfo = New-Object System.Diagnostics.ProcessStartInfo
            $pinfo.FileName = $ExecutablePath
            if ($ExecutablePath -eq "node.exe") {
                $pinfo.Arguments = "src/main.js --add `"$url`""
            }
            else {
                $pinfo.Arguments = "--add `"$url`""
            }
            $pinfo.RedirectStandardOutput = $true
            $pinfo.RedirectStandardError = $true
            $pinfo.UseShellExecute = $false
            $pinfo.CreateNoWindow = $true
            $pinfo.WorkingDirectory = $PSScriptRoot
            
            $p = New-Object System.Diagnostics.Process
            $p.StartInfo = $pinfo
            $p.Start() | Out-Null
            
            # Read output asynchronously to prevent freezing
            $output = $p.StandardOutput.ReadToEnd()
            $error = $p.StandardError.ReadToEnd()
            
            $p.WaitForExit()
        
            $logBox.AppendText("----------------------------------------`r`n")
            $logBox.AppendText($output)
            if ($error) {
                $logBox.AppendText("ERROR:`r`n")
                $logBox.AppendText($error)
            }
            $logBox.AppendText("----------------------------------------`r`n")
            $logBox.AppendText("Done.`r`n")
        
            # Auto-scroll to bottom
            $logBox.SelectionStart = $logBox.Text.Length
            $logBox.ScrollToCaret()

        }
        catch {
            $logBox.AppendText("Error executing script: $_`r`n")
        }
        finally {
            $addButton.Enabled = $true
        }
    })

# Show Form
$form.ShowDialog() | Out-Null
