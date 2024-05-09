#' Method for exporting spectra information into the NMRium format. 
#' 
#' You can use this to export simple x, re and x, re and im spectra
#' If you provide a list containing NMRium data, it will append the new spectra data into the proper place, 
#' so that you can get an overlay of several spectra into the platform. 
#'
#' @param nmriumData nmriumData
#' @param srv A server
#' @param name A name to give to the generated file. Don't include extension
#' @param title String to identify the element in NMRium
#' @param nmriumURL The NMRium instance
#' @param openBrowser It must open the browser to display the TOC?
#' @return void
#' @export
nmriumView <- function(nmriumData, srv, name="default", title="exported from R", nmriumURL="https://www.nmrium.org/nmrium#?toc", openBrowser=TRUE, digits=12) {
  fileServer <-  paste0(srv@protocole, srv@baseURL, ":", srv@port, srv@path)
  nmriumFile <- paste0(name, ".nmrium")
  fullNMRiumLocalPath <- file.path(srv@rootDir, nmriumFile) 
  tocFile <- paste0(name, ".json")
  fullTocLocalPath <- file.path(srv@rootDir, tocFile) 
  write(toJSON(nmriumData, pretty = TRUE, auto_unbox = TRUE, digits = digits), file=fullNMRiumLocalPath)
  write(paste0('[{"file":"', fileServer, nmriumFile, '", "title": "', title, '", "view": "", "selected": true}]'), file=fullTocLocalPath)
  if (openBrowser)
    utils::browseURL( paste0(nmriumURL, "=", fileServer, tocFile ), browser = "open")
}

#' Method for exporting table of content containing spectra information into the NMRium format. 
#' 
#' You can use this to export simple x, re and x, re and im spectra
#' If you provide a list containing NMRium data, it will append the new spectra data into the proper place, 
#' so that you can get an overlay of several spectra into the platform. 
#'
#' @param toc A object describing a TOC. It can contain NMRium object or references to spectra files
#' @param srv A server
#' @param name A name for this toc. This avoid overwriting other toc that could being served
#' @param nmriumURL The NMRium instance
#' @param openBrowser It must open the browser to display the TOC?
#' @return void
#' @export
#' 
nmriumViewToc <- function(toc, srv, name="toc_view", nmriumURL="https://www.nmrium.org/nmrium#?toc", openBrowser=TRUE) {
  # Create a new path to store the files associated with this toc
  tocPath <-file.path(srv@rootDir, name)
  # If the folder does not exist it will create. Else, it will keep all the files, and will override the files
  dir.create(tocPath, showWarnings = FALSE)
  #URL must point to the toc folder
  fileServer <-  paste0(srv@protocole, srv@baseURL, ":", srv@port, srv@path, name, "/")
  
  if ("nmrium" %in% names(toc[[1]])) {
    # If the TOC contains the nmrium files, save them and replace the entries by references to the files
    for (ind in 1:length(toc)) {
      fileName <-  paste0("spectrum", ind, ".nmrium") 
      fullLocalPath <- file.path(tocPath, fileName)
      write(toJSON(toc[[ind]][['nmrium']], pretty = TRUE, auto_unbox = TRUE, digits = 12), file=fullLocalPath)
      toc[[ind]][['nmrium']] <- NA
      toc[[ind]][['file']] <- paste0(fileServer, fileName)
    }
  }
  tocFile <- paste0(name, ".json")
  write(toJSON(toc), file=file.path(tocPath, tocFile))
  
  if (openBrowser)
    utils::browseURL( paste0(nmriumURL, "=", fileServer, tocFile ), browser = "open")
}



