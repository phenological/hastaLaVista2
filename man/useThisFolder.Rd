% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/useThisFolder.NMRium.R, R/useThisFolder.R
\name{useThisFolder}
\alias{useThisFolder}
\title{S4 method to use local folder to serve view and data for visualization objects (S4)}
\usage{
useThisFolder(v)

useThisFolder(v)
}
\arguments{
\item{v}{visualization object}

\item{server}{A server configuration object}
}
\value{
void

void
}
\description{
A method that add the current folder to the server path.

A method that add the current folder to the server path. .
}
\details{
Maybe you are using a folder to store the inputs and outputs of your analysis. In this case, you may prefer to have the data (and the view, if you modify it) stored locally instead of filling the package folder with data.
The method \code{useThisFolder()} allows the user to create a symbolic link within the webserver root directory that points to the current folder.
}
\examples{

v<- new("visualization")
#useThisFolder(v)


v<- new("visualization")
#useThisFolder(v)

}
