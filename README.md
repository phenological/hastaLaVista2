# hastaLaVista
R package that provide interactive graphical interface for metabolic profiling

![HLV Logo](/inst/visu/bin/logo/hlvLogo.png)

## introduction

This package allows 
1. to convert R variables into a JSON object and save it as a file 
1. to select a view (vista) file for the visualization of the data
1. to start a webserver with both data and view files

Vistas (views) are files that contains the description of how to visualize data or results. This can be regarded as a notebook (jupyter) that transforms and displays information. Notebooks, and vistas, can read data from an external file. So if data is updated, the analysis can easily be computed again. It also allows to readily share a data analysis pipeline with others. 

Some analysis are very common and performed by many researchers. Thus, generic vistas could be used by many to process and visualize their own results.

Notebooks already offer this possibility, however notebooks only provide basic features for visualizing results, usually as plain static figures. Unlike notebooks, vistas are complex web applications that can provide a much enhanced interactivity to display and play with results.

**hastaLaVista is developed and tested using Chrome, although it is known to work with other browser. In the case that a feature is not working as expected please try using Chrome before filling an issue**

## installation

Make sure that *devtools* package is installed and run the following command in the R console. 

    options(timeout=1000)
    devtools::install_github("phenological/hastaLaVista2")
    
## Configure Brave to allow localhost connections from nmrium

brave://flags/#brave-localhost-access-permission
brave://settings/privacy
Allow nmrium to access localhost


## Example

```{R}
#devtools::install_github("phenological/hastaLaVista2")
library(hastaLaVista2)


fileServer <- new("server", baseURL = "127.0.0.1",
             port = 7789,
             path = "/",
             protocole = "http://",
             rootDir = "./nmrium",
             init = TRUE)

srv <- initServer(fileServer, force = TRUE)

#Example 1
x <- (1:1000)*2*pi/1000 - pi

nmrium <- exportReIm(x, cos(x), sin(x), output=NA, observeFrequency=400.08247065777, dataType='NMR SPECTRUM', solvent='H2O', nucleus='1H', col='blue', info=list(name="cos(x) + i*sin(x)",  PHC0=0, PHC1=0))
nmriumView(nmrium, fileServer, name = "example", title = "A new title", openBrowser=TRUE)

Example 2
x <- (1:1000)*2*pi/1000 - pi

nmrium <- exportReIm(x, sin(x)+1, NULL, output=NA, observeFrequency=400.08247065777, dataType='NMR SPECTRUM', solvent='H2O', nucleus='1H',col='blue', info=list(name="sin(x)+1"))
nmrium <- exportReIm(x, cos(x)+1, NULL, output=nmrium, observeFrequency=400.08247065777, dataType='NMR SPECTRUM', solvent='H2O', nucleus='1H', col='#009A09', info=list(name="cos(x)+1"))
nmrium <- exportReIm(x, tanh(x)+1, NULL, output=nmrium, observeFrequency=400.08247065777, dataType='NMR SPECTRUM', solvent='H2O', nucleus='1H', col='#A09A09', info=list(name="tanh(x)+1"))

nmriumView(nmrium, fileServer, name = "example", title = "A new title", openBrowser=TRUE)
```
