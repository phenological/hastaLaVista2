#' Method for exporting spectra information into the NMRium format. 
#' 
#' You can use this to export simple x, re and x, re and im spectra
#' If you provide a list containing NMRium data, it will append the new spectra data into the proper place, 
#' so that you can get an overlay of several spectra into the platform. 
#'
#' @param x Independent variable
#' @param yr Real dependent variable
#' @param yi (optional)Imaginary dependent variable
#' @param output Object containing other NMRium data
#' @param observeFrequency Observe frequency in MHz
#' @param dataType Data type format. Use 'NMR FID' if the spectrum is in the time domain (Default 'NMR SPECTRUM')
#' @param solvent String that specify the solvent. (Default 'UNKNOWN') 
#' @param nucleus Observe nucleus.  (Default '1H') 
#' @param col Color for this spectrum (Default black)
#' @param meta A named list with elements that you want to include in the spectra meta i.e. PHC0, PHC1. Used for spectra processing
#' @param info A named list with elements that you want to include in the spectra info. i.e. PHC0, PHC1, name, AGE, SEX, etc. Used for visualization
#' @return list
#' @export

exportReIm <- function(x, yr, yi, output=NA, observeFrequency=600, dataType="NMR SPECTRUM", solvent="UNKNOWN", nucleus="1H", col="#000000", meta=list(PHC0=0, PHC1=0), info=list()) {
  #print(yr)
  newRe <- fillGapsWith(x, yr, 0)
  yr <- newRe[[2]]
  #print(length(newRe))
  #print(is(newRe))
  if (length(x) == length(yi)) {
    yi <-  fillGapsWith(x, yi, 0)[[2]]
  }
  x <-  newRe[[1]]
  meta <- merge_list(meta, list("TITLE"="spectra-data from ReIm",
               "JCAMPDX"="5.00 $$Cheminfo tools 3.4.11",
               "OWNER"="",
               "DATATYPE"="NMR SPECTRUM",
               "DATACLASS"="XYDATA",
               "OBSERVEFREQUENCY"=observeFrequency,
               ".OBSERVENUCLEUS"= nucleus,
               ".SOLVENTNAME"=solvent,
               "XUNITS"="PPM",
               "YUNITS"="Intensity",
               "NPOINTS"=length(x),
               "FIRSTX"=x[[1]],
               "LASTX"=x[[length(x)]],
               "FIRSTY"=yr[[1]],
               "LASTY"=yr[[length(yr)]],
               "XFACTOR"=(x[[length(x)]] - x[[1]]) / (length(x) - 1),
               "YFACTOR"=1,
               "MAXY"=max(yr),
               "MINY"=min(yr),
               "DELTAX"=(x[[length(x)]] - x[[1]]) / (length(x) - 1),
               "DECIM"=0,
               "DSPFVS"=0,
               "FCOR"=0,
               "SW_h"=(x[[length(x)]] - x[[1]]) * observeFrequency,
               "SW"=(x[[length(x)]] - x[[1]]),
               "TD"=length(x),
               "DSPFVS"=0,
               "BF1"=0,
               "SFO1"=observeFrequency,
               "NUC1"=paste0("<",nucleus,">")))
  info <- merge_list(info, list("nucleus"= nucleus,
               "dimension"=1,
               "name"="",
               "isFt"=TRUE,
               "fnMode"="undefined",
               "title"="spectra-data from ReIm",
               "solvent"=solvent,
               "type"="NMR SPECTRUM",
               "dataClass"="XYDATA",
               "firstX"=x[[1]],
               "lastX"=x[[length(x)]],
               "numberOfPoints"=length(x),
               "originFrequency"=observeFrequency,
               "spectralWidth"=(x[[length(x)]] - x[[1]]),
               "acquisitionTime"=length(x)/(2*observeFrequency*(x[[length(x)]] - x[[1]])),
               "groupDelay"=0,
               "increment"=(x[[length(x)]] - x[[1]]) / (length(x) - 1),
               "frequencyOffset"=observeFrequency*1e6))
  
  data <- list("x"=x, "re"=yr, "im"=yi)
  display <- list("color"=col, "isPeaksMarkersVisible"=TRUE, "isRealSpectrumVisible"=TRUE, "isVisible"=TRUE, "isVisibleInDomain"=TRUE)
  
  if(all(is.na(output))) {
    return (list("version"=4, "data"=list("spectra"=list(list("data"=data, "meta"=meta, "info"=info, "display"=display)))))
  } else {
    output[["data"]][["spectra"]] <- append(output[["data"]][["spectra"]], list(list("data"=data, "meta"=meta, "info"=info, "display"=display)))
    return(output)
  }
}

#' Merge 2 named list into a single one. The first one is the template, the second one contain the optional modifications
#'
#' @param la A named list
#' @param lb A second named list
#' @return A named list with all the unique names in la and lb, with the values of la preferably.
#' @export

merge_list <- function(la, lb) {
  for(i in names(la)) {
    lb[[i]] = la[[i]]
  }
  return(lb)
}

#' Given a f(x) -> y, with x being a progression of real numbers, with the same delta on its domain, except for some gaps in the middle
#' this function returns a new pair of x2 and y2 such that all pairs in x,y are contained and x2 is a monotonic progression of real numbers
#' i.e a series of equally spaced data on x, with all the gaps filled with the given value.
#'
#' @param x Independent variable
#' @param y Dependent variable
#' @param value A value to fill the gaps on y
#' @return list(newX, newY)
#' @export

# fillGapsWith(c(1, 2, 2.5, 4, 8, 9, 10), rep(1, 7), 0)
# > x = 1.0  1.5  2.0  2.5  3.0  3.5  4.0  4.5  5.0  5.5  6.0  6.5  7.0  7.5  8.0  8.5  9.0  9.5 10.0
# > y = 1    0    1    1    0    0    1    0    0    0    0    0    0    0    1    0    1    0   1
#
# fillGapsWith(c(1, 2, 3, 4, 5), rep(1, 5), 0)
# > x = 1  2  3  4  5
# > y = 1  1  1  1  1

fillGapsWith <- function(x, y, value) {
  if (isEquallySpacedX(x)) {
    return (list(x, y))
  } else {
    # Flip the arrays
    if(x[[2]] - x[[1]] < 0) {
      x <- rev(x)
      y <- rev(y)
    }
    
    # Look for min deltaX
    deltaX <- x[[2]] - x[[1]]
    for (i in 3:length(x)) {
      if ( x[[i]] - x[[i - 1]] < deltaX) {
        deltaX <- x[[i]] - x[[i - 1]]
      }
    }
    
    progX <-  x[[1]]
    deltaXTol <- deltaX * 0.05
    
    lastX <-  x[[1]]
    progX <- list()
    currentXIndex <- 0
    i <- 1
    while(i <= length(x)) {
      while (abs((lastX + deltaX * currentXIndex) - x[[i]]) > deltaXTol){
        currentXIndex <- currentXIndex + 1
      }
      if (currentXIndex > 1)
        progX <- c(progX, (1:(currentXIndex - 1)) * deltaX + lastX)
      
      prevXIndex <- i
      lastX <- x[[i]]
      currentXIndex <- 0
      while (((i + currentXIndex) < length(x)) && (abs(x[[i + currentXIndex + 1]] - x[[i + currentXIndex]] - deltaX) <= deltaXTol)){
        currentXIndex <- currentXIndex + 1
      }
      
      progX <- c(progX, x[prevXIndex: (prevXIndex + currentXIndex)])
      
      lastX <- x[[prevXIndex + currentXIndex]]
      i <- prevXIndex + currentXIndex + 1
      currentXIndex <- 1
    }
    
    j <- 1
    progY <- rep(value, length(progX))
    for (i in 1:length(progX)) {
      if (progX[[i]] == x[[j]]) {
        progY[[i]] <- y[[j]]
        j <- j + 1
      }
    }
    
    if(x[[2]] - x[[1]] < 0) {
      progX <- rev(progX)
      progY <- rev(progY)
    }
    
    return (list(progX, progY))
  }
}

#' Checks that x is a progression of real numbers with constant delta
#' @param x Independent variable
#' @return boolean
#' @export

# isEquallySpacedX(c(1, 2, 3, 4)) == TRUE
# isEquallySpacedX(c(4, 3, 2, 1)) == TRUE
# isEquallySpacedX(c(4, 3.01, 2, 1)) == TRUE
# isEquallySpacedX(c(4, 2, 1)) == FALSE

isEquallySpacedX <- function(x) {
  tol <- 0.05
  deltaX <- x[[2]] - x[[1]]
  deltaXTol <- abs(deltaX * tol)
  for (i in 3:length(x)) {
    if (abs(x[[i]] - x[[i - 1]] - deltaX) > deltaXTol ) {
      return(FALSE)
    }
  }
  return(TRUE)
}


# nmrium <- exportReIm(ppm, Y[1,], NULL, output=NA, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#AA0109')
# nmrium <- exportReIm(ppm, Y[2,], NULL, output=nmrium, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#0000FF')
# nmrium <- exportReIm(ppm, Y[3,], NULL, output=nmrium, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#FFFF00')
# nmrium <- exportReIm(ppm, Y[4,], NULL, output=nmrium, observeFrequency=600, dataType='NMR SPECTRUM', solvent='UNKNOWN', nucleus='1H', PHC0=0, PHC1=0, col='#00AA00')
# 
#write(toJSON(nmrium, pretty = TRUE, auto_unbox = TRUE, digits = 12), file='export.nmrium')

