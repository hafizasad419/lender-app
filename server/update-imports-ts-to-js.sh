#!/bin/bash

# Define the root directory (current working directory)
rootDir=$(pwd)

# Find all .js files recursively in the project directory (excluding node_modules)
find "$rootDir" -name "*.js" -not -path "*/node_modules/*" | while read -r file; do
    # Read the file content
    fileContent=$(<"$file")

    # Loop over all import statements in the file content
    # Match the import statement and capture the path
    while [[ "$fileContent" =~ import[[:space:]]+["']([^"']+)["'] ]]; do
        match="${BASH_REMATCH[1]}"

        # Skip imports from node_modules or libraries (defined in dependencies)
        if [[ "$match" =~ ^(bcryptjs|colors|concurrently|cookie-parser|cors|dotenv|express|helmet|jsonwebtoken|mongoose|morgan|nodemailer|nodemailer-express-handlebars|nodemon) ]]; then
            # Remove the matched import and continue to the next match
            fileContent="${fileContent/${BASH_REMATCH[0]}/}"
            continue
        fi

        # Skip if the import already has a .js extension
        if [[ ! "$match" =~ \.js$ ]]; then
            # Add .js extension to the import path
            newImportPath="${match}.js"

            # Replace the old import path with the new one
            fileContent="${fileContent/${BASH_REMATCH[0]}/${BASH_REMATCH[0]//"$match"/$newImportPath}}"
        fi
    done

    # Save the modified content back to the file
    echo "$fileContent" > "$file"

    # Output which file was updated
    echo "Updated imports in: $file"
done

echo "Import statements have been updated."
