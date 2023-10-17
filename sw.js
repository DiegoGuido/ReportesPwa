const STATIC = 'staticv7';
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamicv1';
//Todos aquellos archivos propios de nuestra aplicación


const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
];

const APP_SHELL = [
    '/',
    'index.html',
    'js/app.js',
    'img/cosmos.jpg',
    'css/styles.css',
    'img/char.jpg',
    '/pages/offline.html',
];

const OFFLINE_URL = [

]

const deleteCache = async (key) => {
    await caches.delete(key);
  };
  
  const deleteOldCaches = async () => {
    //Se tienen las llaves de las caches que se buscan quedar
    const cacheKeepList = [STATIC, INMUTABLE, DYNAMIC];
    //Se obtienen las llaves de las caches actuales
    const keyList = await caches.keys();
    //Se obtienen mediante un filter las caches a eliminar
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    //Se eliminan todas las caches que no coincidan con las "cacheKeepList"
    await Promise.all(cachesToDelete.map(deleteCache));
  };


self.addEventListener('install', (e)=>{
    console.log("Instalando");
    const staticCache = caches.open(STATIC).then((cache)=> {
        cache.addAll(APP_SHELL);
    })

    const inmutableCache = caches.open(INMUTABLE)
    .then((cache)=> {
        cache.addAll(APP_SHELL_INMUTABLE);
    })

    e.waitUntil(Promise.all([staticCache, inmutableCache, deleteOldCaches]));
   // e.skipWaiting();
});


self.addEventListener('activate', (e)=> {
    console.log('Activado');
});


self.addEventListener('fetch', (e)=> {
        console.log(e.request.url);
          const source = fetch(e.request)
          .then((res)=> {          
              return res;
          }).catch(err=> {    
            if (e.request.url === 'http://127.0.0.1:5500/pages/page2.html') {
                return caches.match('/pages/offline.html');
            }else{
                return caches.match('/index.html');
            }
            
              
          })
          e.respondWith(source);

});