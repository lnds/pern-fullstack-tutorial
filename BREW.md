# Instalación de Node usando Brew

Si no has instalado aún brew en tu Mac puedes hacerlo ejecutando este comando:

        $ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

Luego de instalado puedes hacer:

        $ brew install node
        $ brew install postgresql

Para iniciar postgres:

        $ brew services start postgresql
        
Para detener postgres:

        $ brew services stop postgresql