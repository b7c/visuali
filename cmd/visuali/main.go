package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"

	"github.com/b7c/visuali/pkg/visuali"
)

func loadConfig(path string) (cfg visuali.Config, err error) {
	f, err := os.OpenFile(path, os.O_RDONLY, 0)
	if err != nil {
		return
	}
	defer f.Close()

	err = json.NewDecoder(f).Decode(&cfg)
	return
}

func main() {
	cfgPath := flag.String("config", "", "Path to the configuration file.")
	flag.Parse()

	cfg := visuali.Config{}

	if *cfgPath != "" {
		var err error
		cfg, err = loadConfig(*cfgPath)
		if err != nil {
			fmt.Fprintf(os.Stderr, "failed to load configuration: %s\n", err)
			return
		}
	}

	visuali.NewServer(cfg).Run()
}
