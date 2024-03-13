import requests
import bs4

HEADER = {
    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
}

# checking for a static link first, but this should change as the user switches to another url
# link should be dynamic
link = "https://www.youtube.com/watch?v=qZp5gf9xgnE"

