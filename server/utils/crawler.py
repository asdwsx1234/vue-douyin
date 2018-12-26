# encoding=utf8
import urllib2
import re
import os
import json
import MySQLdb
import random


import sys
defaultencoding = 'utf-8'
if sys.getdefaultencoding() != defaultencoding:
    reload(sys)
    sys.setdefaultencoding(defaultencoding)
    
result = []

def download(url):
  #获取网页源代码
  #url="http://www.pearvideo.com/category_8"
  #模拟浏览器去请求服务器
  headers={
      'User-Agent':'Mozilla / 5.0(Windows NT 10.0;WOW64;rv:62.0) Gecko / 20100101Firefox / 62.0',
  }
  urls = urllib2.Request(url,headers=headers)
  html = urllib2.urlopen(urls) 
  #获取视频id   .*？匹配所有
  reg='<a href="(.*?)" class="vervideo-lilink actplay">'
  video_id=re.findall(reg,html.read())

  # #拼接URL地址
  video_url=[]#接收拼接好的url
  starturl='http://www.pearvideo.com'+''
  for vid in video_id:
    newurl=starturl+'/'+vid
    #print(newurl)
    video_url.append(newurl)
    #获取视频播放地址
  for purl in video_url:
    urls = urllib2.Request(purl,headers=headers)
    html = urllib2.urlopen(urls) 
    text = html.read()
    reg='ldUrl="",srcUrl="(.*?)"'
    playurl=re.findall(reg,text)
    # print(playurl)
    #获取视频标题
    reg='<h1 class="video-tt">(.*?)</h1>'
    video_name=re.findall(reg,text)
    # print(video_name)

    reg='<div class="summary">(.*?)</div>'
    video_desc=re.findall(reg,text)
    # print(video_desc)

    reg='''<div id="poster" class="" data-id="">
            <img class="img" src="(.*?)" alt=.*?>
            <i class="i-icon play-icon"></i>
        </div>'''
    video_cover=re.findall(reg,text)
    result.append({
      'playurl': playurl,
      'video_name': video_name,
      'video_desc': video_desc,
      'video_cover': video_cover
    })
    # print(video_cover)
    #下载视频
    # print('正在下载视频%s'%video_name)

      # path='video'
      # if path not in os.listdir():
      #     os.mkdir(path)
      # filepath=path+"/%s"%video_name[0]+'.mp4'
      # #下载
      # urllib.request.urlretrieve(playurl[0],filepath)

def downloadmore():
  n=12    
  while True:
    if n>252:
        # 跳出循环的
        return
    url = "http://www.pearvideo.com/category_loading.jsp?reqType=5&categoryId=8&start=%d&mrd=%.16f"% (n, random.random())
    n+=12
    download(url)

downloadmore()


db = MySQLdb.connect(host='localhost',user='root',passwd='123456',db='test',charset='utf8')
cursor = db.cursor()
#执行sql
cursor.execute("select * from VideoInfo")
res = cursor.fetchall()
i = 0
while i < 250:
  videoId = res[i][0]
  playurl = result[i]['playurl'][0]
  # video_name = result[i]['video_name'][0]
  video_desc = result[i]['video_desc'][0]
  video_cover = result[i]['video_cover'][0]
  sql = "UPDATE VideoInfo SET videoPath = '%s', videoDesc = '%s',videoCover = '%s' where videoId = '%s'" % (playurl, video_desc, video_cover, videoId)
  try:
    cursor.execute(sql)
    db.commit()
  except:
    db.rollback()
  i = i + 1
db.close()