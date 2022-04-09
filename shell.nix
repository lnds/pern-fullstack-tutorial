with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    nodejs
    yarn 
    postgresql
  ];
  shellHook = ''
    mkdir -p .nix-node
    export NODE_PATH=$PWD/.nix-node
    export NPM_CONFIG_PREFIX=$PWD/.nix-node
    export PATH=$NODE_PATH/bin:$PATH
    export PGHOST=$HOME/postgres
    export PGDATA=$PGHOST/data
    export PGDATABASE=postgres
    export PGLOG=$PGHOST/postgres.log

    mkdir -p $PGHOST

    if [ ! -d $PGDATA ]; then
      initdb --auth=trust --no-locale --encoding=UTF8
    fi

    if ! pg_ctl status
    then
      pg_ctl start -l $PGLOG -o "--unix_socket_directories='$PGHOST'"
    fi 
 '';
}
