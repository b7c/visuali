package visuali

import (
	"net"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/b7c/visuali/pkg/visuali/assets"
)

// A visuali server.
type Server struct {
	cfg  Config
	http *http.Server
}

// Creates a new visuali server with the specified configuration.
func NewServer(cfg Config) *Server {
	root := chi.NewRouter()

	root.Route("/api", func(r chi.Router) {
		r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("ok"))
		})
	})

	root.HandleFunc("/*", ServeSPA(assets.Dist))

	if cfg.ListenAddr == "" {
		cfg.ListenAddr = "127.0.0.1:3333"
	}

	return &Server{
		cfg: cfg,
		http: &http.Server{
			Handler: root,
		},
	}
}

// Runs the visuali server.
func (server *Server) Run() error {
	listener, err := net.Listen("tcp", server.cfg.ListenAddr)
	if err != nil {
		return err
	}
	InfoLog.Printf("listening on %s", server.cfg.ListenAddr)
	return server.http.Serve(listener)
}
