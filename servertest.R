library('jsonlite')
library('stringr')

Sys.setlocale(, 'chinese')
Sys.setenv(LANG = "en_US.UTF-8")

bc<-read.csv(file.path(getwd(), './b_coded.csv'), encoding="GB18030", stringsAsFactors=FALSE)
zc<-read.csv(file.path(getwd(), './z_coded.csv'), encoding="GB18030", stringsAsFactors=FALSE)
mc<-read.csv(file.path(getwd(), './medicine.csv'), encoding="GB18030", stringsAsFactors=FALSE)


binghou <- rep_len("", dim(zc)[1])
binghou_map = list()
for(i in 1:(dim(zc)[1])) {
  binghou[i] = zc[i, 1]
  binghou_map[zc[i, 1]] = i
}
	
bingzheng_map = list()
bingzheng <- rep_len("", dim(bc)[1])
for(i in 1:(dim(bc)[1])) {
  bingzheng[i] = bc[i, 1]
  bingzheng_map[bc[i, 1]] = i
}

medicine_map = list()
medicine <- rep_len("", dim(mc)[1])
for(i in 1 : (dim(mc)[1])){
	medicine[i] = mc[i, 1]
	medicine_map[mc[i, 1]] = i
}

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

server <- function(bh2bz){
	conn <- socketConnection(host="localhost", port = 6011, blocking=TRUE, server=TRUE, open="r+", timeout=1000)
	while(TRUE) {
		jsonData <- readLines(conn, 1)
		df <- tryCatch(
			{
				fromJSON(jsonData)
			},
			error=function(cond) {
				print("Error fromJSON")
				return (NA)
			}
		)
		if (is.na(df)) {
			break
		}
		type <- tryCatch(
			{
				df$type
			},
			error=function(cond) {
				print("Error type")
				return (NA)
			}
		)
		if (is.na(type)) {
			break
		}
		data <- tryCatch(
			{
				df$data
			},
			error=function(cond) {
				print("Error data")
				return (NA)
			}
		)
		if (is.na(data)) {
			break
		}
		
		if(type == 'wenzhen'){
			print('wenzhen')
			print(df$data)
			df$data <- wenzhen(data, bh2bz)
			print('df:')
		}
		else if(type == 'tuijian'){
			print('xinchufang:')
			options(digits=3)
			freq = as.double(df$data)
			print(freq)
			df$data <- tuijian(freq)
			#tuijian(freq)
			#print(df$data)
		}
		else if(type == 'dendrogram'){
			print('julei:')
			print(df$data[1])
			juleiPlot1(df$data[1], df$data[2], df$data[3])
		}
	  writeLines(toJSON(df), conn)
	}
	close(conn)
}



wenzhen <- function(data, bh2bz){
	bh <- c(0,0,0,0,0)
	for(i in 1 : 5){
		if(i <= length(data))
			bh[i] = strtoi(data[i])
		else break
	}
	print(bh)
	
    zhenduan = NULL
    for(i in 1:length(bh)) {
      if (bh[i] == 0) {
        next
      }
      if(i == 1) {
        zhenduan = bh2bz[[binghou[bh[i]]]]
      } else {
        zhenduan = intersect(zhenduan, bh2bz[[binghou[bh[i]]]])
     }
    }
	
	print(zhenduan)
	diseases = NULL
	if(!length(zhenduan)){
		diseases <- rep_len(0, 1)
	}
	else{
		diseases <- rep_len(0, length(zhenduan))
		for(i in 1:length(zhenduan)){
			diseases[i] = bingzheng_map[[zhenduan[i]]]
		}
	}
	print(diseases)
    
	return(diseases)
	#return(bingzheng_map[[zhenduan]])
}

tuijian <- function(freq){
		s <- dat[,itemFrequency(dat)>freq]
		bw <- labels(s)
		ss <- as.matrix(bw)
		ret <- c()
		
		
		for(i in 1 : length(ss)){
			
			prescription = unlist(strsplit(ss[i], ','))
			#index_list <- rep_len(0, length(prescription))
			index_list <- c()
			index <- c()
			#print(prescription)
			prescription[1] = substr(prescription[1], 2, str_length(prescription[1]))
			if(length(prescription) > 1){
				prescription[length(prescription)] = substr(prescription[length(prescription)], 1, str_length(prescription[length(prescription)]) - 1)
			}
			for(j in 1 : length(prescription)){
				
				index <- append(index_list, medicine_map[[prescription[j]]])
				index_list <- index
				#print(index)
			}
			ret[[i]] <- index
		}
		print(ret)
		return(ret)
}

juleiPlot1 <- function(distance_index, juleiMethod_index, cutval){
	distanceList = c("euclidean", "maximum", "manhattan", "canberra", "binary")
	juleiMethodList = c("ward.D", "ward.D2", "single", "complete", "average", "mcquitty", "centroid")
	distance = distanceList[distance_index]
	juleiMethod = juleiMethodList[juleiMethod_index]
	print(distance)
	print(juleiMethod)
	xv = m1
    par(family="serif")
	jpeg(file = "static//pictures//tree_structure.jpeg")
    plot(hclust(dist(data.matrix(xv),distance), method=juleiMethod),
    xlab=paste(distance, "distance;", juleiMethod, "clustering"))
	
    abline(h=cutval, lty=2, col="red")
	dev.off()
	return("ready")
}

server(bh2bz)

