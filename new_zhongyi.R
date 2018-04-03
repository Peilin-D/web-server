
## Bowen Cai
##预置代码
Sys.setlocale("LC_ALL", 'en_GB.UTF-8')
Sys.setenv(LANG = "en_US.UTF-8")
yiy<-read.csv("yiy.csv",fileEncoding="GB18030",stringsAsFactors=FALSE,header=T)
head(yiy)
bc<-read.csv("b_coded.csv",fileEncoding="GB18030",stringsAsFactors=FALSE)
zc<-read.csv("z_coded.csv",fileEncoding="GB18030",stringsAsFactors=FALSE)
te<-read.csv("zhong1.csv",fileEncoding="GB18030",header=T)
attach(te)
##con <- dbConnect(RSQLite::SQLite(), "zhiliang")
##dbWriteTable(con, "zl",zl)
##size<-dbReadTable(con,"zl")
##dbDisconnect(con)
##install.packages("MASS")
##install.packages("factoextra")
##install.packages("tidyverse")
##install.packages("dendextend")
##install.packages("cluster")
##install.packages("arules")
##install.packages("arulesViz")
##install.packages("shinydashboard")
##install.packages("showtext")


#library(RSQLite())
library(showtext)
library("arulesViz")
library("arules")
library(tidyverse)  # data manipulation
library(cluster)    # clustering algorithms
library(factoextra) # clustering visualization
library(dendextend) # for comparing two dendrograms
library(MASS)
library(arules)
library(DBI)
##con<-dbConnect(RSQLite::SQLite(),"jiansuo")
##te<-dbReadTable(con,"te")
##attach(te)
##dbDisconnect(con)
##con<-dbConnect(SQLite(),"zhongyi.sqlite")
##sql1<-paste("SELECT * FROM zhongyi_bowen",sep="")
##te<-dbGetQuery(con,sql1)
##attach(te)
##dbDisconnect(con)
##library(dplyr)
##yiyw<-read.csv("~/Desktop/yiy_weight.csv",fileEncoding="GB18030",stringsAsFactors=FALSE,header=T)
##name<-yiyw[,5]
##weight<-yiyw[,9]
##ab<-data.frame(name,weight)
##bw<-plyr::ddply(ab, .(name), summarize, num = length(name), totalB = sum(weight))
##total<-bw[,3]
##w<-bw[order(bw[,3],decreasing=T),]
##n<-w[,3]/w[,2]
##weight<-data.frame(w,n)
##colnames(weight)<-c("药名","使用次数","总质量/g","单位处方中的平均质量/g")
##zl<-weight

#con<-dbConnect(RSQLite::SQLite(),"zhiliang")
#zl<-dbReadTable(con,"zl")
#dbDisconnect(con)

yiyuan_sample = yiy

## For 肠癌病
## Build database
dat_V5 = NULL

dat_12_val =unique(yiyuan_sample[,12])[which(bc[,1]=="肠癌病")]
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
med.dictionary <- names(itemFrequency(dat))[itemFrequency(dat)>0.5]
m1 <- matrix(0, nrow=length(dat_X5), ncol=length(med.dictionary))
for(i in 1:length(dat_X5))
{
    m1[i, which(med.dictionary %in% dat_X5[[i]])] = 1
}
colnames(m1) = med.dictionary
m1 = t(m1)
zero_var_col = which(apply(m1,2,var) ==0 )
dis = dissimilarity(m1,  method = "pearson")
##hc.cut <- hcut(dis, k = 5, scale = FALSE, hc_method = "ward.D2")

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
## App
## Bowen Cai
##预置代码
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
dataset<-dat
bin=T
vars=40
supp=0.1
conf=0.5

for(i in 1:ncol(dataset)) {
    if(class(dataset[,i]) %in% c('numeric', 'integer')) dataset[,i] <- Rsenal::depthbin(dataset[,i], nbins=10)
}
m1<-as.data.frame(m1)
require(shiny)
require(cluster)
# global variables ...
nms = names(m1)
cmeths = c("ward.D", "ward.D2",
"single", "complete", "average", "mcquitty",
"median", "centroid")
dmeths = c("euclidean", "maximum", "manhattan", "canberra",
"binary")

library(shiny)
library(shinydashboard)
ui <- dashboardPage(
dashboardHeader(title="智能中医"),
dashboardSidebar(
sidebarMenu(
menuItem("智能问诊", tabName = "智能问诊"),
menuItem("药物关联度分析",tabName="药物关联度分析"),
menuItem("中药材检索", tabName="中药材检索"),
menuItem("在线交流", tabName="在线交流"),
menuItem("新处方聚类", tabName="新处方聚类"),
menuItem("新处方推荐", tabName="新处方推荐")
)
),
dashboardBody(
tabItems(
tabItem(tabName = "智能问诊",
fluidPage(

titlePanel("智能问诊"),

tabsetPanel(
tabPanel("请选择病候",
sidebarPanel(
# Changed values of the widgets
textInput("bing1", "病候I","气滞血瘀证"),
textInput("bing2", "病候II","冲任失调证"),
textInput("bing3","病候III","痰湿中阻证"),
textInput("bing4","病候IV","湿热下注证"),
textInput("bing5","病候V","邪毒久留,气滞血瘀证"),
submitButton(text="Submit")
)
)
),
mainPanel(
verbatimTextOutput("vv"),
verbatimTextOutput("value")

)
),
h1("智能问诊")),

tabItem(tabName = "药物关联度分析",
pageWithSidebar(

headerPanel("药物关联度分析"),

sidebarPanel(

conditionalPanel(
condition = "input.samp=='Sample'",
numericInput("nrule", 'Number of Rules', 40), br()
),

conditionalPanel(
condition = "input.mytab=='graph'",
radioButtons('graphType', label='Graph Type', choices=c('itemsets','items'), inline=T), br()
),

conditionalPanel(
condition = "input.lhsv=='Subset'",
uiOutput("choose_lhs"), br()
),

conditionalPanel(
condition = "input.rhsv=='Subset'",
uiOutput("choose_rhs"), br()
),

conditionalPanel(
condition = "input.mytab=='grouped'",
sliderInput('k', label='Choose # of rule clusters', min=1, max=150, step=1, value=15), br()
),

conditionalPanel(
condition = "input.mytab %in%' c('grouped', 'graph', 'table', 'datatable', 'scatter', 'paracoord', 'matrix', 'itemFreq')",
radioButtons('samp', label='Sample', choices=c('All Rules', 'Sample'), inline=T), br(),
uiOutput("choose_columns"), br(),
sliderInput("supp", "Support:", min = 0, max = 1, value = supp , step = 1/10000), br(),
sliderInput("conf", "Confidence:", min = 0, max = 1, value = conf , step = 1/10000), br(),
selectInput('sort', label='Sorting Criteria:', choices = c('lift', 'confidence', 'support')), br(), br(),
numericInput("minL", "Min. items per set:", 2), br(),
numericInput("maxL", "Max. items per set::", 3), br(),
radioButtons('lhsv', label='LHS variables', choices=c('All', 'Subset')), br(),
radioButtons('rhsv', label='RHS variables', choices=c('All', 'Subset')), br(),
submitButton(text="Submit"),
downloadButton('downloadData', 'Download Rules as CSV')
)

),

mainPanel(
tabsetPanel(id='mytab',
tabPanel('Grouped', value='grouped', plotOutput("groupedPlot", width='100%', height='100%')),
tabPanel('Graph', value='graph', plotOutput("graphPlot", width='100%', height='100%')),
tabPanel('Scatter', value='scatter', plotOutput("scatterPlot", width='100%', height='100%')),
tabPanel('Parallel Coordinates', value='paracoord', plotOutput("paracoordPlot", width='100%', height='100%')),
tabPanel('Matrix', value='matrix', plotOutput("matrixPlot", width='100%', height='100%')),
tabPanel('ItemFreq', value='itemFreq', plotOutput("itemFreqPlot", width='100%', height='100%')),
tabPanel('Table', value='table', verbatimTextOutput("rulesTable"))
)
)

)
,
h2("药物关联度分析")),

tabItem(tabName="中药材检索",
fluidPage(

titlePanel("中药材检索"),

tabsetPanel(
tabPanel("请选择药材",
sidebarPanel(
# Changed values of the widgets
textInput("jiansuo", "药物检索","漏芦"),
submitButton(text="Submit")
)
)
),
mainPanel(
verbatimTextOutput("v"),
verbatimTextOutput("va")

)
),
h3("中药材检索")),

tabItem(tabName="在线交流",
bootstrapPage(
# We'll add some custom CSS styling -- totally optional
includeCSS("~/Desktop/shinychat.css"),

# And custom JavaScript -- just to send a message when a user hits "enter"
# and automatically scroll the chat window for us. Totally optional.
includeScript("~/Desktop/sendOnEnter.js"),

div(
# Setup custom Bootstrap elements here to define a new layout
class = "container-fluid",
div(class = "row-fluid",
# Set the page title
tags$head(tags$title("专家交流平台")),

# Create the header
div(class="span6", style="padding: 10px 0px;",
h1("中医项目"),
h4("讨论中...")
), div(class="span6", id="play-nice",
"IP Addresses are logged... be a decent human being."
)

),
# The main panel
div(
class = "row-fluid",
mainPanel(
# Create a spot for a dynamic UI containing the chat contents.
uiOutput("chat"),

# Create the bottom bar to allow users to chat.
fluidRow(
div(class="span10",
textInput("entry", "")
),
div(class="span2 center",
actionButton("send", "Send"),
submitButton(text="Submit")
)
)
),
# The right sidebar
sidebarPanel(
# Let the user define his/her own ID
textInput("user", "Your User ID:", value=""),
tags$hr(),
h5("Connected Users"),
# Create a spot for a dynamic UI containing the list of users.
uiOutput("userList"),
tags$hr()
)
)
)
)
,
h4("在线交流")),
tabItem(tabName="新处方聚类",
fluidPage(
#
# we will have four components on sidebar: selectors for
# distance, agglomeration method, height for tree cut, and variables to use
#
titlePanel(paste("新处方聚类")),
sidebarPanel(
helpText(paste("Select distance:" )),
fluidRow(
selectInput("dmeth", NULL, choices=dmeths,
selected=dmeths[1])),
helpText(paste("Select clustering method:" )),
fluidRow(
selectInput("meth", NULL, choices=cmeths,
selected=cmeths[1])),
helpText(paste("Select height for cut:" )),
fluidRow(
numericInput("cutval", NULL, value=4, min=0, max=10, step=1)),
helpText(paste("Select variables for clustering from", substitute(df), ":" )),
fluidRow(
checkboxGroupInput("vars", NULL, choices=nms,
selected=nms[1:ncol(m1)]),submitButton(text="Submit")

)
),
#
# main panel is a simple plot
#
mainPanel(
tabsetPanel(
tabPanel("tree",
plotOutput("plot1")),
tabPanel("新处方聚类可视化",
plotOutput("pairsplot")),
tabPanel("药物剂量查询",
tableOutput("silplot"))
)
)
) ,

h5("新处方聚类")),
tabItem(tabName="新处方推荐",
fluidPage(

titlePanel("新处方推荐"),

tabsetPanel(
tabPanel("请选择频率",
sidebarPanel(
# Changed values of the widgets
numericInput("chufang", "频率", 0.50,
min = 0.30, max = 1.0, step = 0.1),
submitButton(text="Submit"),
downloadButton('downloaddata', '下载新处方')
)
)
),
mainPanel(
tabsetPanel(
tabPanel("处方推荐",
verbatimTextOutput("dist")),
tabPanel("病机病理",
verbatimTextOutput("dayin")
)
)
))
,
h6("新处方推荐"))
)
)
)
library(stringr)
# Globally define a place where all users can share some reactive data.
vars <- reactiveValues(chat=NULL, users=NULL)

# Restore the chat log from the last session.
if (file.exists("chat.Rds")){
    vars$chat <- readRDS("chat.Rds")
} else {
    vars$chat <- "欢迎使用中医医师讨论平台!"
}

#' Get the prefix for the line to be added to the chat window. Usually a newline
#' character unless it's the first line.
linePrefix <- function(){
    if (is.null(isolate(vars$chat))){
        return("")
    }
    return("<br />")
}
server <- function(input,output,server,session){
    output$vv=renderPrint({
        print('诊断结果如下')
    })
    output$value = renderText({
        bh=c(input$bing1,input$bing2,input$bing3,input$bing4,input$bing5)
        zhenduan = NULL
        for(i in 1:length(bh)){
            if(bh[i]==""){
                next
            }
            if(i==1)
            {
                zhenduan = bh2bz[[bh[[i]]]]
            } else{
                zhenduan = intersect(zhenduan, bh2bz[[bh[[i]]]])
            }
        }
        br()
        br()
        print(zhenduan)
    })
    output$choose_columns <- renderUI({
        checkboxGroupInput("cols", "Choose variables:",
        choices  = colnames(dataset),
        selected = colnames(dataset)[1:40])
    })
    output$choose_lhs <- renderUI({
        checkboxGroupInput("colsLHS", "Choose LHS variables:",
        choices  = input$cols,
        selected = input$cols[1])
    })
    output$choose_rhs <- renderUI({
        checkboxGroupInput("colsRHS", "Choose RHS variables:",
        choices  = input$cols,
        selected = input$cols[1])
    })
    ## Extracting and Defining arules
    rules <- reactive({
        tr <- as(dataset[,input$cols], 'transactions')
        arAll <- apriori(tr, parameter=list(support=input$supp, confidence=input$conf, minlen=input$minL, maxlen=input$maxL))
        if(input$rhsv=='Subset' & input$lhsv!='Subset'){
            varsR <- character()
            for(i in 1:length(input$colsRHS)){
                tmp <- with(dataset, paste(input$colsRHS[i], '=', levels(as.factor(get(input$colsRHS[i]))), sep=''))
                varsR <- c(varsR, tmp)
            }
            ar <- subset(arAll, subset=rhs %in% varsR)
        } else if(input$lhsv=='Subset' & input$rhsv!='Subset') {
            varsL <- character()
            for(i in 1:length(input$colsLHS)){
                tmp <- with(dataset, paste(input$colsLHS[i], '=', levels(as.factor(get(input$colsLHS[i]))), sep=''))
                varsL <- c(varsL, tmp)
            }
            ar <- subset(arAll, subset=lhs %in% varsL)
        } else if(input$lhsv=='Subset' & input$rhsv=='Subset') {
            varsL <- character()
            for(i in 1:length(input$colsLHS)){
                tmp <- with(dataset, paste(input$colsLHS[i], '=', levels(as.factor(get(input$colsLHS[i]))), sep=''))
                varsL <- c(varsL, tmp)
            }
            varsR <- character()
            for(i in 1:length(input$colsRHS)){
                tmp <- with(dataset, paste(input$colsRHS[i], '=', levels(as.factor(get(input$colsRHS[i]))), sep=''))
                varsR <- c(varsR, tmp)
            }
            ar <- subset(arAll, subset=lhs %in% varsL & rhs %in% varsR)
        } else {
            ar <- arAll
        }
        quality(ar)$conviction <- interestMeasure(ar, method='conviction', transactions=tr)
        quality(ar)$hyperConfidence <- interestMeasure(ar, method='hyperConfidence', transactions=tr)
        quality(ar)$cosine <- interestMeasure(ar, method='cosine', transactions=tr)
        quality(ar)$chiSquare <- interestMeasure(ar, method='chiSquare', transactions=tr)
        quality(ar)$coverage <- interestMeasure(ar, method='coverage', transactions=tr)
        quality(ar)$doc <- interestMeasure(ar, method='doc', transactions=tr)
        quality(ar)$gini <- interestMeasure(ar, method='gini', transactions=tr)
        quality(ar)$hyperLift <- interestMeasure(ar, method='hyperLift', transactions=tr)
        ar
    })
    # Rule length
    nR <- reactive({
        nRule <- length(input$nrule)
    })
    ## Grouped Plot #########################
    output$groupedPlot <- renderPlot({
        ar <- rules()
        par(family="STKaiti")
        plot(sort(ar, by=input$sort)[1:nR()], method='grouped', control=list(k=input$k))
    }, height=800, width=800)
    ## Graph Plot ##########################
    output$graphPlot <- renderPlot({
        ar <- rules()
        par(family="STKaiti")
        plot(sort(ar, by=input$sort)[1:nR()], method='graph', control=list(type=input$graphType))
    }, height=800, width=800)
    ## Scatter Plot ##########################
    output$scatterPlot <- renderPlot({
        ar <- rules()
        par(family="STKaiti")
        plot(sort(ar, by=input$sort)[1:nR()], method='scatterplot')
    }, height=800, width=800)
    ## Parallel Coordinates Plot ###################
    output$paracoordPlot <- renderPlot({
        ar <- rules()
        par(family="STKaiti")
        plot(sort(ar, by=input$sort)[1:nR()], method='paracoord')
    }, height=800, width=800)
    ## Matrix Plot ###################
    output$matrixPlot <- renderPlot({
        ar <- rules()
        par(family="STKaiti")
        plot(sort(ar, by=input$sort)[1:nR()], method='matrix', control=list(reorder=T))
    }, height=800, width=800)
    ## Item Frequency Plot ##########################
    output$itemFreqPlot <- renderPlot({
        trans <- as(dataset[,input$cols], 'transactions')
        par(family="STKaiti")
        itemFrequencyPlot(trans)
    }, height=800, width=800)
    ## Rules Printed ########################
    output$rulesTable <- renderPrint({
        #hack to disply results... make sure this match line above!!
        #ar <- apriori(dataset[,input$cols], parameter=list(support=input$supp, confidence=input$conf, minlen=input$minL, maxlen=input$maxL))
        ar <- rules()
        inspect(sort(ar, by=input$sort))
    })
    ## Download data to csv ########################
    output$downloadData <- downloadHandler(
    filename = 'arules_data.csv',
    content = function(file) {
        write.csv(rules2df(rules()), file)
    }
    )
    output$v=renderPrint({
        print('检索结果如下')
    })
    output$va = renderPrint({
        bh=input$jiansuo
        br()
        br()
        a<-as.matrix((te[,which(names(te)==input$jiansuo)]));colnames(a)<-input$jiansuo
        rownames(a)<-c("药物来源","性状","鉴别","性味归经","功能主治","用法用量","注意事项","贮藏")
        print(a,sep="\n",indices=T)
    })
    sessionVars <- reactiveValues(username = "")
    # Track whether or not this session has been initialized. We'll use this to
    # assign a username to unininitialized sessions.
    init <- FALSE
    # When a session is ended, remove the user and note that they left the room.
    session$onSessionEnded(function() {
        isolate({
            vars$users <- vars$users[vars$users != sessionVars$username]
            vars$chat <- c(vars$chat, paste0(linePrefix(),
            tags$span(class="user-exit",
            sessionVars$username,
            "left the room.")))
        })
    })
    # Observer to handle changes to the username
    observe({
        # We want a reactive dependency on this variable, so we'll just list it here.
        input$user
        if (!init){
            # Seed initial username
            sessionVars$username <- paste0("User", round(runif(1, 10000, 99999)))
            isolate({
                vars$chat <<- c(vars$chat, paste0(linePrefix(),
                tags$span(class="user-enter",
                sessionVars$username,
                "entered the room.")))
            })
            init <<- TRUE
        } else{
            # A previous username was already given
            isolate({
                if (input$user == sessionVars$username || input$user == ""){
                    # No change. Just return.
                    return()
                }
                # Updating username
                # First, remove the old one
                vars$users <- vars$users[vars$users != sessionVars$username]
                # Note the change in the chat log
                vars$chat <<- c(vars$chat, paste0(linePrefix(),
                tags$span(class="user-change",
                paste0("\"", sessionVars$username, "\""),
                " -> ",
                paste0("\"", input$user, "\""))))
                # Now update with the new one
                sessionVars$username <- input$user
            })
        }
        # Add this user to the global list of users
        isolate(vars$users <- c(vars$users, sessionVars$username))
    })
    # Keep the username updated with whatever sanitized/assigned username we have
    observe({
        updateTextInput(session, "user",
        value=sessionVars$username)
    })
    # Keep the list of connected users updated
    output$userList <- renderUI({
        tagList(tags$ul( lapply(vars$users, function(user){
            return(tags$li(user))
        })))
    })
    # Listen for input$send changes (i.e. when the button is clicked)
    observe({
        if(input$send < 1){
            # The code must be initializing, b/c the button hasn't been clicked yet.
            return()
        }
        isolate({
            # Add the current entry to the chat log.
            vars$chat <<- c(vars$chat,
            paste0(linePrefix(),
            tags$span(class="username",
            tags$abbr(title=Sys.time(), sessionVars$username)
            ),
            ": ",
            tagList(input$entry)))
        })
        # Clear out the text entry field.
        updateTextInput(session, "entry", value="")
    })
    # Dynamically create the UI for the chat window.
    output$chat <- renderUI({
        if (length(vars$chat) > 500){
            # Too long, use only the most recent 500 lines
            vars$chat <- vars$chat[(length(vars$chat)-500):(length(vars$chat))]
        }
        # Save the chat object so we can restore it later if needed.
        saveRDS(vars$chat, "chat.Rds")
        # Pass the chat log through as HTML
        HTML(vars$chat)
    })
    output$plot1 <- renderPlot({
        xv = m1[,input$vars]
        par(family="STKaiti")
        plot(hclust(dist(data.matrix(xv),method=input$dmeth), method=input$meth),
        xlab=paste(input$dmeth, "distance;", input$meth, "clustering"))
        abline(h=input$cutval, lty=2, col="red")
    })
    output$pairsplot <- renderPlot({
        hc.cut <- hcut(dis, k = input$cutval, scale = FALSE, hc_method = "ward.D2")
        fviz_cluster(hc.cut,  data = m1[,-zero_var_col], ggtheme = theme(text = element_text(family = "STKaiti"))) ##Clustering graph with shaded area to be each cluster
    })
    output$silplot <- renderTable({
        zl
    })
    output$dist <- renderPrint({
        s <- dat[,itemFrequency(dat)>input$chufang]
        inspect(s,linebreak=FALSE)
        ## Download Chufang
        output$downloaddata<-downloadHandler(
        filename='chufang_data.csv',
        content=function(file){
            write.csv(rules2df(s),file)
        }
        )
    }
)
    
    output$dayin<-renderPrint({
   print("大肠癌包括结肠癌和直肠癌。大肠包括回肠和广肠（直肠）。回肠上接阑门，下接广肠，广肠下端为魄门（肛门），其经脉络肺，统摄于脾。",sep="\n",indices=T)   
   br()
   print("大肠癌的发生以正气虚损为内因，邪毒入侵为外因，两者相互影响，正气虚损，易招致邪毒入侵，更伤正气，且正气既虚，无力抗邪，致邪气留恋，气、瘀、毒留滞大肠，壅蓄不散，大肠传导失司，日久则积生于内，发为大肠癌。")
   br()
   print("外感湿热久居湿地，外感湿邪，导致水湿困脾，脾失健运，则内外之水湿日久不去，可引发本病。")
   print("饮食不节恣食膏粱厚味、酒酪之晶，或过食生冷，或暴饮暴食，均可损伤脾胃，滋生水湿，水湿不去化热而下迫大肠，与肠中之糟粕交阻搏击或日久成毒，损伤肠络而演化为本病。情志所伤所愿不遂，肝气郁结，肝木太过克伐脾土，脾失健运，水湿内生，郁而化热，湿热合邪，下迫大肠，也可诱生本病")
   br()
   print("大肠癌（结肠癌、直肠癌）病机的中心环节是湿热，并由湿热进一步演化而为热毒、瘀毒蕴结于肠中，日久形成结块，故以清热利湿、化瘀解毒为治疗原则。病至晚期，正虚邪实，当根据患者所表现的不同证候，以补虚为主兼以解毒散结。")
   br()
   print("治法：活血化瘀，清热解毒。方药：膈下逐瘀汤加味。本方用桃仁、红花、五灵脂、延胡索、丹皮、赤芍、当归、川芎活血通经，行瘀止痛；以香附、乌药、枳壳调理气机；甘草调和诸药，共呈活血化瘀，行气止痛的功效。临床应用常配伍黄连、黄柏、败酱等，以加强清热解毒之力。")
    })
}

showtext_auto()

shinyApp(ui,server)
