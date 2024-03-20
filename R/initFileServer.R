

#' @title checks if server is running and if not starts it
#' @description
#' This functions starts the http server that is necessary to the \code{github.com/npellet/visualizer} to work.
#' If a server is already running (daemon_list is empty), then nothing happens.
#'
#' @param server a server object
#' @param force if true, will force the server to restart. Else, it will just return the running server if any, else it will create a new one.
#' @return httpuv::server
#' @examples
#' #start new server object
#' s <- new("server")
#' #initServer(s)
#'
#' @export
#' @importFrom utils tail

initServer <- function (server, force = TRUE) {

  if (isS4(server)) {
    if (!is.numeric(server@port)) {
      warning("initServer: port is not of type numeric and will be ignored")
      server@port <- 0
    }
    
    dir.create(file.path(server@rootDir), showWarnings = FALSE)
  
    servers = httpuv::listServers()
    runningServer = NULL
    for (serv in servers) {
      if (server@port == serv$getPort() & server@baseURL == serv$getHost()) {
        runningServer = serv
      }
       
      if (force && !is.null(runningServer)) {
        httpuv::stopServer(runningServer)
        print(paste0("Server",serv$getHost(),":",serv$getPort(), " stoped"))
        runningServer = NULL
      }
    }
      
    if (is.null(runningServer)) {
      runningServer = httpuv::startServer(host = server@baseURL, port = server@port, app = list(call=serveFolder(server = server)))
      print(paste0("Server",runningServer$getHost(),":",runningServer$getPort(), " started"))
    }
    return(runningServer)
  }
}

serveFolder <- function(server) {
  file_handler <- function(req) {
    # Get the file path from the request
    file_path <- file.path(server@rootDir, req$PATH_INFO)
    print(file_path)
    
    # Check if the file exists
    if (file.exists(file_path)) {
      # Read the file
      file_data <- readBin(file_path, raw(), file.info(file_path)$size)
      
      # Create the response
      res <- list(
        status = 200L,
        headers = list("Content-Type" = "application/octet-stream", 
                       "Access-Control-Allow-Origin"="*",
                       "Access-Control-Allow-Headers"="Origin, X-Requested-With, Content-Type, Accept",
                       "Access-Control-Allow-Methods"="GET, POST, PUT, DELETE, OPTIONS"),
        
        body = file_data
      )
    } else {
      # Create an error response if the file doesn't exist
      res <- list(
        status = 404L,
        headers = list(),
        body = "File not found"
      )
    }
    
    return(res)
  }
  
  return(file_handler)
}
