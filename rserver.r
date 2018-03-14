library('jsonlite')

server <- function(){
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
	    writeLines(toJSON(df), conn)
	}
	close(conn)
}

server()