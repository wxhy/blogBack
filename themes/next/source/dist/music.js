const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: false,
    audio: [
      {
        name: "Windy Hill",
        artist: '羽肿',
        url: 'http://www.ytmp3.cn/down/53896.mp3',
        cover: 'http://img.ytmp3.cn/image/67.jpg',
      },
      {
        name: '风筝误',
        artist: '刘珂矣',
        url: 'http://www.ytmp3.cn/down/46423.mp3',
        cover: 'http://img.ytmp3.cn/image/97.jpg',
      }
    ]
});