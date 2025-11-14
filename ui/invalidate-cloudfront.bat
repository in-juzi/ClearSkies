@echo off
REM Get CloudFront distribution ID for clearskies.juzi.dev

FOR /F "tokens=*" %%i IN ('aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?contains(@, 'clearskies.juzi.dev')]].Id" --output text') DO SET DIST_ID=%%i

IF "%DIST_ID%"=="" (
    echo Error: Could not find CloudFront distribution for clearskies.juzi.dev
    echo Make sure you have CloudFront permissions: cloudfront:ListDistributions
    exit /b 1
)

echo Found distribution ID: %DIST_ID%
echo Creating invalidation for all paths ^(/^*^)

aws cloudfront create-invalidation --distribution-id %DIST_ID% --paths "/*"

IF %ERRORLEVEL% EQU 0 (
    echo Invalidation created successfully!
    echo It may take 1-5 minutes to complete.
) ELSE (
    echo Error creating invalidation. Make sure you have cloudfront:CreateInvalidation permission.
)
