import requests
from lxml import etree
import pymysql
import random
import threading
import time
import logging
from queue import Queue
import re


class MovieSpider():
    def __init__(self):
        self.file_object = open("amazon.txt", 'a')
        self.file_object.write("asin, state\n")

    def randHeader(self):
        head_connection = ['Keep-Alive', 'close']
        head_accept = ['text/html, application/xhtml+xml, */*']
        head_accept_language = ['zh-CN,fr-FR;q=0.5', 'en-US,en;q=0.8,zh-Hans-CN;q=0.5,zh-Hans;q=0.3']
        head_user_agent = ['Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
                           'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36',
                           'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; rv:11.0) like Gecko)',
                           'Mozilla/5.0 (Windows; U; Windows NT 5.2) Gecko/2008070208 Firefox/3.0.1',
                           'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070309 Firefox/2.0.0.3',
                           'Mozilla/5.0 (Windows; U; Windows NT 5.1) Gecko/20070803 Firefox/1.5.0.12',
                           'Opera/9.27 (Windows NT 5.2; U; zh-cn)',
                           'Mozilla/5.0 (Macintosh; PPC Mac OS X; U; en) Opera 8.0',
                           'Opera/8.0 (Macintosh; PPC Mac OS X; U; en)',
                           'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.12) Gecko/20080219 Firefox/2.0.0.12 Navigator/9.0.0.6',
                           'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Win64; x64; Trident/4.0)',
                           'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)',
                           'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)',
                           'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.6.2000 Chrome/26.0.1410.43 Safari/537.1 ',
                           'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E; QQBrowser/7.3.9825.400)',
                           'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:21.0) Gecko/20100101 Firefox/21.0 ',
                           'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.92 Safari/537.1 LBBROWSER',
                           'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; BIDUBrowser 2.x)',
                           'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/3.0 Safari/536.11']

        header = {
            'Connection': head_connection[0],
            'Accept': head_accept[0],
            'Accept-Language': head_accept_language[1],
            'User-Agent': head_user_agent[random.randrange(0, len(head_user_agent))]
        }
        return header

    def make_url(self, movie_type, movie_num, movie_or_tv, page=1):
        # http://www.ygdy8.net/html/gndy/china/list_4_2.html
        page = page
        if movie_type and movie_num:
            url = "http://www.dytt8.net/html/" + movie_or_tv + "/"
            url += movie_type + "/"
            url += "list_%s" % (str(movie_num))
            url += "_%s" % (str(page))
            url += ".html"
            return url

    def getDataById(self, page=2):

        url = "https://www.dy2018.com/html/gndy/dyzz/index.html"  # 首页
        url2 = "https://www.dy2018.com/html/gndy/dyzz/index_%d.html" % page  # 第二页
        try:
            ret = requests.get(url=url2, headers=self.randHeader()).text
        except:
            ret = None
        if ret:
            html = etree.HTML(ret)
            movie_url_list = html.xpath("//tr[2]/td[2]/b/a/@href")  # 爬取每页的电影列表的url

        for movie_url in movie_url_list:
            movie_url = "https://www.dy2018.com" + movie_url  # 电影详情的链接
            ret2 = requests.get(url=movie_url, headers=self.randHeader())
            ret2.encoding = "GBK"
            ret2 = ret2.text
            html = etree.HTML(ret2)

            try:
                download_url = html.xpath("//*[@id='Zoom']/table[1]/tbody/tr/td//a/text()")  # 电影的下载链接
            except:
                print("download_url error")
                continue
            try:
                movie_score = float(html.xpath("//div[2]/ul/div[1]/span[1]/strong/text()")[0])  # 电影评分
            except:
                movie_score = 0
            try:
                movie_index_name = html.xpath("//div[1]/h1/text()")[0]  # 电影页面名称
            except:
                movie_index_name = ""
            try:
                translate = html.xpath("//p[2]/text()")[0].strip()[6:]
            except:
                continue
            try:
                movie_type_list = html.xpath("//div[1]/span[2]/a/text()")  # 分类列表
                movie_type_string = ''
                for type in movie_type_list:
                    movie_type_string = movie_type_string + "|" + type + "|"  # 分类字符串，拼接
            except:
                movie_type_string = ''
            print(movie_type_string, "type")
            print(movie_score, "score")
            try:
                movie_release_time = html.xpath("//span[3]/text()[1]")[0].strip()[5:]
            except:
                movie_release_time = ''

            # 封面图片链接
            try:
                img_src = html.xpath("//p[1]/img/@src")
            except:
                img_src = ''

            print(movie_release_time, "===time")
            print(movie_index_name, "========index")
            print(translate, "=====translate")
            try:
                is_save = self.findFromDB(title=translate)
            except:
                is_save = None
            if is_save:
                print("请勿重复存储")
                continue
            try:
                self.insertIntoDB(title=translate, score=movie_score, download_url=download_url,
                                  remark=movie_index_name, release=movie_release_time, movie_type=movie_type_string,
                                  img_src=img_src)
                print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>success", translate)
            except Exception as e:
                print(e)
                pass

    def findFromDB(self, title):
        db = pymysql.connect(host='45.63.51.252', user='root', passwd='123456', db='movie', port=3306, charset='utf8')
        cursor = db.cursor()
        sql = ' select * from movie where title = %s '
        try:
            res = cursor.execute(sql, (title))
            db.commit()
        except:
            res = None
        cursor.close()
        db.close()
        if not res:
            return False
        return cursor.fetchone() is not None

    def insertIntoDB(self, title, score, download_url, remark, release, movie_type, img_src):
        now = time.time()
        db = pymysql.connect(host='45.63.51.252', user='root', passwd='123456', db='movie', port=3306, charset='utf8')
        cursor = db.cursor()
        print(score, "score22")
        sql = " insert into movie(title,score,download_url,create_time,movie_type,release_time,remark,img_url)  values(%s,%s,%s,%s,%s,%s,%s,%s)"
        cursor.execute(sql, (
            title, score, download_url, now, movie_type, release, remark, img_src))
        db.commit()
        cursor.close()
        db.close()


class ThreadCrawl(threading.Thread):  # ThreadCrawl类继承了Threading.Thread类

    def __init__(self, queue):  # 子类特有属性， queue
        FORMAT = time.strftime("[%Y-%m-%d %H:%M:%S]", time.localtime()) + "[AmazonSpider]-----%(message)s------"
        logging.basicConfig(level=logging.INFO, format=FORMAT)
        threading.Thread.__init__(self)
        self.queue = queue
        self.spider = MovieSpider()  # 子类特有属性spider， 并初始化，将实例用作属性

    def run(self):
        while True:
            success = True
            item = self.queue.get()  # 调用队列对象的get()方法从队头删除并返回一个项目item
            try:
                self.spider.getDataById(item)  # 调用实例spider的方法getDataById(item)
            except:
                success = False
            if not success:
                self.queue.put(item)
            logging.info("now queue size is: %d" % self.queue.qsize())  # 队列对象qsize()方法，返回队列的大小
            self.queue.task_done()  # 队列对象在完成一项工作后，向任务已经完成的队列发送一个信号


class AmazonSpiderJob():
    def __init__(self, size, qs):
        self.size = size  # 将形参size的值存储到属性变量size中
        self.qs = qs

    def work(self):
        toSpiderQueue = Queue()  # 创建一个Queue队列对象
        for i in range(self.size):
            t = ThreadCrawl(toSpiderQueue)  # 将实例用到一个类的方法中
            t.setDaemon(True)
            t.start()
        for q in self.qs:
            toSpiderQueue.put(q)  # 调用队列对象的put()方法，在对尾插入一个项目item
        toSpiderQueue.join()  # 队列对象，等到队列为空，再执行别的操作


def run():
    print("start spider====")
    movie_obj = MovieSpider()
    for i in range(66, 301):
        print(i)
        movie_obj.getDataById(page=i)
    print("finish spider")


run()
