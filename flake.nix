{
  description = "Confy - Simple tool for storing secrets on public domain";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: 
  let
    pkgs = import nixpkgs {
      system = "x86_64-linux";
    };
  in
  {
    packages.x86_64-linux.confy = pkgs.buildNpmPackage {
      name = "confy";
      src = ./.;
      npmDeps = pkgs.importNpmLock {
        npmRoot = ./.;
      };
      npmBuildHook = "";
      npmConfigHook = pkgs.importNpmLock.npmConfigHook;
    };
    packages.x86_64-linux.default = self.packages.x86_64-linux.confy;

    devShell.x86_64-linux = with pkgs; mkShell {
      buildInputs = [
        nodejs
      ];
    };

  };
}
