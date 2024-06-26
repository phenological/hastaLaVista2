% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/initFileServer.R
\name{initServer}
\alias{initServer}
\title{checks if server is running and if not starts it}
\usage{
initServer(server, force = TRUE)
}
\arguments{
\item{server}{a server object}

\item{force}{if true, will force the server to restart. Else, it will just return the running server if any, else it will create a new one.}
}
\value{
httpuv::server
}
\description{
This functions starts the http server that is necessary to the \code{github.com/npellet/visualizer} to work.
If a server is already running (daemon_list is empty), then nothing happens.
}
\examples{
#start new server object
s <- new("server")
#initServer(s)

}
