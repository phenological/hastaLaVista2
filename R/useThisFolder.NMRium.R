#' S4 method to use local folder to serve view and data for visualization objects (S4)
#'
#' A method that add the current folder to the server path. 
#' 
#' Maybe you are using a folder to store the inputs and outputs of your analysis. In this case, you may prefer to have the data (and the view, if you modify it) stored locally instead of filling the package folder with data.
#' The method `useThisFolder()` allows the user to create a symbolic link within the webserver root directory that points to the current folder.
#' 
#' @param server A server configuration object
#' @return void
#' @examples
#'
#' v<- new("visualization")
#' #useThisFolder(v)
#'
#' @export
#' @importFrom utils tail


useThisFolder <- function(server) {
  folderPath = getwd() 
  to <- paste0(server@rootDir, "/public/r")
  
  # create dir if not existing
  if (!dir.exists(to)) {
    
    warning("windows user may have to run rstudio as administrator")
    switch(.Platform$OS.type,
           unix = file.symlink(from = folderPath, to = to),
           windows = shell(sprintf("mklink /D %s %s", 
                                   normalizePath(to, mustWork = FALSE),
                                   normalizePath(folderPath)
           ))
    )
    
    warning(paste("simlink created: ", to))
    
  } else {
    warning("repository already linked, no simlink created")      
  }
}
