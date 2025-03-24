$logos = @{
    "html5" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg"
    "css3" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg"
    "javascript" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg"
    "react" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg"
    "nodejs" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg"
    "mongodb" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg"
    "sass" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg"
    "nextjs" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg"
    "git" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg"
    "python" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg"
    "tensorflow" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/tensorflow/tensorflow-original.svg"
    "aws" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original.svg"
    "gcp" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/googlecloud/googlecloud-original.svg"
    "keras" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/keras/keras-original.svg"
    "mysql" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg"
    "tableau" = "https://raw.githubusercontent.com/devicons/devicon/master/icons/tableau/tableau-original.svg"
}

# Create the logos directory if it doesn't exist
$logosDir = "assets/logos"
if (-not (Test-Path $logosDir)) {
    New-Item -ItemType Directory -Path $logosDir -Force
}

# Download each logo
foreach ($logo in $logos.GetEnumerator()) {
    $outputPath = Join-Path $logosDir "$($logo.Key).svg"
    Write-Host "Downloading $($logo.Key) logo to $outputPath"
    Invoke-WebRequest -Uri $logo.Value -OutFile $outputPath
} 