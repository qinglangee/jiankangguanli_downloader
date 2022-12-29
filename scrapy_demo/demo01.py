import scrapy 

class QuotesSpider(scrapy.Spider):
    name = "quotes"

    # start_request 可以用 start_urls 代替， 见 demo02.py
    def start_requests(self):
        urls = [
            'https://quotes.toscrape.com/page/1/',
            'https://quotes.toscrape.com/page/2/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = f'output/demo01-quotes-{page}.html'
        with open(filename, 'wb') as f:
            f.write(response.body)
        self.log(f'Saved file {filename}')


# run 
# scrapy runspider demo01.py