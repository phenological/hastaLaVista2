% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/exportReImToNMRium.R
\name{merge_list}
\alias{merge_list}
\title{Merge 2 named list into a single one. The first one is the template, the second one contain the optional modifications}
\usage{
merge_list(la, lb)
}
\arguments{
\item{la}{A named list}

\item{lb}{A second named list}
}
\value{
A named list with all the unique names in la and lb, with the values of la preferably.
}
\description{
Merge 2 named list into a single one. The first one is the template, the second one contain the optional modifications
}
