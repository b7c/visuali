package visuali

import (
	"log"
	"os"
)

var (
	InfoLog *log.Logger
	WarnLog *log.Logger
	ErrLog  *log.Logger
)

func init() {
	flags := log.Flags()

	InfoLog = log.New(os.Stdout, "[INF] ", flags)
	WarnLog = log.New(os.Stderr, "[WRN] ", flags)
	ErrLog = log.New(os.Stderr, "[ERR] ", flags)
}
