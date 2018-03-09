server <- function(){
  while(TRUE){
    writeLines("Listening...")
    con <- socketConnection(host="localhost", port = 6011, blocking=TRUE,
                            server=TRUE, open="r+")
    data <- readLines(con, 1)
    print(data)
    response <- toupper(data) 
    writeLines(response, con) 
    close(con)
  }
}


run <- function(){
	Sys.setlocale(, 'chinese')
	Sys.setenv(LANG = "en_US.UTF-8")
	yiy<-read.csv("yiy.csv",fileEncoding="GB18030",stringsAsFactors=FALSE,header=T)
	head(yiy)
	bc<-read.csv("b_coded.csv",fileEncoding="GB18030",stringsAsFactors=FALSE)
	zc<-read.csv("z_coded.csv",fileEncoding="GB18030",stringsAsFactors=FALSE)
	te<-read.csv("zhong1.csv",fileEncoding="GB18030",header=T)
	attach(te)
	
	library(showtext)
	library("arulesViz")
	library("arules")
	library(tidyverse)  # data manipulation
	library(cluster)    # clustering algorithms
	library(factoextra) # clustering visualization
	library(dendextend) # for comparing two dendrograms
	library(MASS)
	library(arules)

	dat_V5 = NULL
	yiyuan_sample = yiy
	
	dat_12_val =unique(yiyuan_sample[,12])[which(bc[,1]=="肠癌病")]
	tmp = yiyuan_sample[yiyuan_sample[,12] ==dat_12_val,]

	#tmp = yiyuan_sample[yiyuan_sample[,12] ==dat_12_val,]
	for (i in 1:(length(unique(tmp[,14]))))
	{
		tmp_1 = tmp[tmp[,14] == unique(tmp[,14])[i],]
		for(j in 1:(length(unique(tmp_1[,2]))))
		{
			tmp_2 = tmp_1[tmp_1[,5]== unique(tmp_1[,2])[j],]
			dat_V5[i] = tmp_1[,5]
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
		m1[i, which(med.dictionary %in% dat_X5[i])] = 1
	}
	colnames(m1) = med.dictionary
	m1 = t(m1)
	zero_var_col = which(apply(m1,2,var) ==0 )
	bc[which(bc[,1]=="_瘕病"),1]<-"癥瘕病"
	bh2bz = list()  # mapping from binghou to bingzheng
	for(i in 1:(dim(zc)[1]))
	{
		bz.tmp = yiy[(yiy[,13] == zc[i,2]),12]
		bh2bz[[zc[i,1]]] =  c(bc[ bc[,2] %in% bz.tmp,1])
	}

	## this is your input
	bh = c("肝肾阴虚证", "肝肾亏虚证","气阴两虚,邪毒内蕴证")

	## this is your output
	zhenduan = NULL
	for(i in 1:length(bh))
	{
		if(i==1)
		{
			zhenduan = bh2bz[[bh[[i]]]]
		} else{
			zhenduan = intersect(zhenduan, bh2bz[[bh[[i]]]])
		}
	}
}

#datalist <- loaddata()
#loadpackage()
run()
server()

