server <- function(){
  while(TRUE){
    writeLines("Listening...")
    con <- socketConnection(host="localhost", port = 6011, blocking=TRUE,
                            server=TRUE, open="r+")
    data <- readLines(con, 2)
    print(data)
    #response <- toupper(data) 
    writeLines(data, con) 
    close(con)
  }
}


run <- function(){
	Sys.setlocale(, 'chinese')
	Sys.setenv(LANG = "en_US.UTF-8")

	yiy<-read.csv("yiy.csv", encoding="GB18030", stringsAsFactors=FALSE, header=T)

	library("arulesViz")
	library("arules")
	library(methods)
	library(tidyverse)  # data manipulation
	library(cluster)    # clustering algorithms
	library(factoextra) # clustering visualization
	library(dendextend) # for comparing two dendrograms
	library(MASS)
	library(arules)
	library(cluster)
	library(showtext)
	yiyuan_sample = yiy

	## Build database

	dat_V5 = NULL

	dat_12_val = unique(yiyuan_sample[,12])[1]
	tmp = yiyuan_sample[yiyuan_sample[,12] ==dat_12_val,]

	#tmp = yiyuan_sample[yiyuan_sample[,12] ==dat_12_val,]
	for (i in 1:length(unique(tmp[,14])))
	{
	  tmp_1 = tmp[tmp[,14] == unique(tmp[,14])[i],]
	  for(j in 1:length(unique(tmp_1[,2])))
	  {
		tmp_2 = tmp_1[tmp_1[,5]== unique(tmp_1[,2])[j],]
		dat_V5[[i]] = tmp_1[,5]
	  }
	}

	dat_X5<-dat_V5
	dat <- as(dat_V5, "transactions")
	rules <- apriori(dat, parameter = list(supp = 0.5, conf = 0.9, target = "rules"))
	sy<-itemFrequency(dat)
	yy<-which(sy>0.01)
	ssy<-sy[yy]
	med.dictionary <- names(itemFrequency(dat))[itemFrequency(dat)>0.6]
	m1 <- matrix(0, nrow=length(dat_X5), ncol=length(med.dictionary))

	for(i in 1:length(dat_X5))
	{
		m1[i, which(med.dictionary %in% dat_X5[[i]])] = 1
	}

	colnames(m1) = med.dictionary
	m1 = t(m1)
	zero_var_col = which(apply(m1,2,var) ==0 )
	bc<-read.csv(file.path(getwd(), './b_coded.csv'), encoding="GB18030", stringsAsFactors=FALSE)
	zc<-read.csv(file.path(getwd(), './z_coded.csv'), encoding="GB18030", stringsAsFactors=FALSE)
	te<-read.csv(file.path(getwd(), './zhong1.csv'), encoding="GB18030", stringsAsFactors=FALSE, header=T)
	attach(te)

	# 1 sec
	bh2bz = list()  # mapping from binghou to bingzheng
	for(i in 1:(dim(zc)[1])) {
	  bz.tmp = yiy[(yiy[,13] == zc[i,2]),12]
	  bh2bz[[zc[i,1]]] = c(bc[ bc[,2] %in% bz.tmp,1])
	}
	##

	dataset<-dat
	bin=T
	vars=40
	supp=0.1
	conf=0.5

	# 2 sec
	for(i in 1:ncol(dataset)) {
	  if(class(dataset[,i]) %in% c('numeric', 'integer')) dataset[,i] <- Rsenal::depthbin(dataset[,i], nbins=10)
	}
	##

	m1<-as.data.frame(m1)
	# global variables ...
	nms = names(m1)
	cmeths = c(
	  "ward.D", "ward.D2",
	  "single", "complete",
	  "average", "mcquitty",
	  "median", "centroid"
	)
	dmeths = c("euclidean", "maximum", "manhattan", "canberra", "binary")

	rules2df <- function(rules, list=F){
		df <- as(rules, 'data.frame')
		df[,1] <- as.character(df[,1])
		df$lhs <- sapply(df[,1], function(x) strsplit(x, split=' => ')[[1]][1])
		df$rhs <- sapply(df[,1], function(x) strsplit(x, split=' => ')[[1]][2])
		df$lhs <- gsub(pattern='\\{', replacement='', x=df$lhs)
		df$lhs <- gsub(pattern='}', replacement='', x=df$lhs)
		df$rhs <- gsub(pattern='\\{', replacement='', x=df$rhs)
		df$rhs <- gsub(pattern='}', replacement='', x=df$rhs)
	}
}

#datalist <- loaddata()
#loadpackage()
run()
server()

