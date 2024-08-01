{
  description = "A very basic flake";

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

    # packages.x86_64-linux.confy = nixpkgs.legacyPackages.x86_64-linux.hello;
    # packages.x86_64-linux.default = self.packages.x86_64-linux.confy;

    devShell.x86_64-linux = with pkgs; mkShell {
      buildInputs = [
        nodejs
      ];
    };

  };
}
