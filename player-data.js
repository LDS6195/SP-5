// Builds the player pool from player-ratings.js. Edit ratings there, not here.
(function exposePlayerPool(root, factory) {
  const ratings = typeof module !== "undefined" && module.exports ? require("./player-ratings.js") : root.PROXY_RATINGS;
  const players = factory(ratings);
  if (typeof module !== "undefined" && module.exports) module.exports = players;
  root.PROXY_PLAYER_POOL = players;
})(typeof globalThis !== "undefined" ? globalThis : this, ({ ROLE_WEIGHTS, COLUMNS, TABLE, OUT_OF_POSITION_PENALTY = 0 }) => {
  const PLAYER_IMAGES = {
    "Sun Tzu": {
      "title": "Sun Tzu",
      "url": "https://upload.wikimedia.org/wikipedia/commons/c/cf/%E5%90%B4%E5%8F%B8%E9%A9%AC%E5%AD%99%E6%AD%A6.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
      "pageUrl": "https://en.wikipedia.org/wiki/Sun_Tzu",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Alexander the Great": {
      "title": "Alexander the Great",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Alexander_Mosaic_detail_of_Alexander_the_Great_%283x4_cropped%29.jpg/330px-Alexander_Mosaic_detail_of_Alexander_the_Great_%283x4_cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Alexander_the_Great",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Hannibal": {
      "title": "Hannibal",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Hannibal_Barca_bust_from_Capua_photo.jpg/330px-Hannibal_Barca_bust_from_Capua_photo.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Hannibal",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Winston Churchill": {
      "title": "Winston Churchill",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg/330px-Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Winston_Churchill",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Julius Caesar": {
      "title": "Julius Caesar",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Retrato_de_Julio_C%C3%A9sar_%2826724093101%29_%28cropped%29.jpg/330px-Retrato_de_Julio_C%C3%A9sar_%2826724093101%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Julius_Caesar",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Ulysses S. Grant": {
      "title": "Ulysses S. Grant",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Ulysses_S._Grant_1870-1880_%28cropped%29.jpg/330px-Ulysses_S._Grant_1870-1880_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Ulysses_S._Grant",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "George Washington": {
      "title": "George Washington",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/330px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/George_Washington",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Magnus Carlsen": {
      "title": "Magnus Carlsen",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/MagnusCarlsen24.jpg/330px-MagnusCarlsen24.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Magnus_Carlsen",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Joan of Arc": {
      "title": "Joan of Arc",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Joan_of_Arc_miniature_graded.jpg/330px-Joan_of_Arc_miniature_graded.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Joan_of_Arc",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Napoleon Bonaparte": {
      "title": "Napoleon",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/330px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Napoleon",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Cleopatra": {
      "title": "Kleopatra-VII.-Altes-Museum-Berlin1.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kleopatra-VII.-Altes-Museum-Berlin1.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Kleopatra-VII.-Altes-Museum-Berlin1.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Genghis Khan": {
      "title": "YuanEmperorAlbumGenghisPortrait.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/YuanEmperorAlbumGenghisPortrait.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/YuanEmperorAlbumGenghisPortrait.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Abraham Lincoln": {
      "title": "Abraham%20Lincoln%20%28bust%20by%20Jones%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Abraham_Lincoln_(bust_by_Jones).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Abraham%20Lincoln%20%28bust%20by%20Jones%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Queen Elizabeth I": {
      "title": "Queen%20Elizabeth%20I%20from%20NPG%20%284%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Queen_Elizabeth_I_from_NPG_(4).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Queen%20Elizabeth%20I%20from%20NPG%20%284%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Theodore Roosevelt": {
      "title": "Theodore%20Roosevelt%20by%20the%20Pach%20Bros.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Theodore_Roosevelt_by_the_Pach_Bros.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Theodore%20Roosevelt%20by%20the%20Pach%20Bros.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Catherine the Great": {
      "title": "Catherine%20the%20Great%20%28Faberg%C3%A9%20egg%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Catherine_the_Great_(Faberg%C3%A9_egg).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Catherine%20the%20Great%20%28Faberg%C3%A9%20egg%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Charlemagne": {
      "title": "Charlemagne%20denier%20Mayence%20812%20814.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Charlemagne_denier_Mayence_812_814.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Charlemagne%20denier%20Mayence%20812%20814.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Shaka Zulu": {
      "title": "KingShaka.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/KingShaka.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/KingShaka.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Peter the Great": {
      "title": "Inconnu%20d%27apr%C3%A8s%20J.-M.%20Nattier%2C%20Portrait%20de%20Pierre%20Ier%20%28mus%C3%A9e%20de%20l%E2%80%99Ermitage%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Inconnu_d'apr%C3%A8s_J.-M._Nattier%2C_Portrait_de_Pierre_Ier_(mus%C3%A9e_de_l%E2%80%99Ermitage).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Inconnu%20d%27apr%C3%A8s%20J.-M.%20Nattier%2C%20Portrait%20de%20Pierre%20Ier%20%28mus%C3%A9e%20de%20l%E2%80%99Ermitage%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Franklin D. Roosevelt": {
      "title": "Station%20M%C3%A9tro%20Franklin%20D%20Roosevelt%20Ligne%201%20-%20Paris%20VIII%20%28FR75%29%20-%202022-03-31%20-%202.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Station_M%C3%A9tro_Franklin_D_Roosevelt_Ligne_1_-_Paris_VIII_(FR75)_-_2022-03-31_-_2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Station%20M%C3%A9tro%20Franklin%20D%20Roosevelt%20Ligne%201%20-%20Paris%20VIII%20%28FR75%29%20-%202022-03-31%20-%202.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "George S. Patton": {
      "title": "General%20George%20Patton%20by%20Robert%20F.%20Cranston%2C%20Lee%20Elkins%2C%20and%20Harry%20Warnecke%2C%201945%2C%20color%20carbro%20print%2C%20from%20the%20National%20Portrait%20Gallery%20-%20NPG-NPG%2095%20404Patton-000002.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/General_George_Patton_by_Robert_F._Cranston%2C_Lee_Elkins%2C_and_Harry_Warnecke%2C_1945%2C_color_carbro_print%2C_from_the_National_Portrait_Gallery_-_NPG-NPG_95_404Patton-000002.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/General%20George%20Patton%20by%20Robert%20F.%20Cranston%2C%20Lee%20Elkins%2C%20and%20Harry%20Warnecke%2C%201945%2C%20color%20carbro%20print%2C%20from%20the%20National%20Portrait%20Gallery%20-%20NPG-NPG%2095%20404Patton-000002.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Queen Victoria": {
      "title": "Queen%20Victoria%20MET%20DT5422.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Queen_Victoria_MET_DT5422.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Queen%20Victoria%20MET%20DT5422.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Richard the Lionheart": {
      "title": "Richard%20I%20of%20England%20in%20the%20Brief%20Abridgement%20of%20the%20Chronicles%20of%20England.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Richard_I_of_England_in_the_Brief_Abridgement_of_the_Chronicles_of_England.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Richard%20I%20of%20England%20in%20the%20Brief%20Abridgement%20of%20the%20Chronicles%20of%20England.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "George W. Bush": {
      "title": "George-W-Bush.jpeg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/George-W-Bush.jpeg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/George-W-Bush.jpeg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Niccolo Machiavelli": {
      "title": "Portrait%20of%20Niccol%C3%B2%20Machiavelli%20by%20Santi%20di%20Tito.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_of_Niccol%C3%B2_Machiavelli_by_Santi_di_Tito.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Portrait%20of%20Niccol%C3%B2%20Machiavelli%20by%20Santi%20di%20Tito.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bill Belichick": {
      "title": "Photo%20of%20the%20Day-%204-20%20%2834163554775%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Photo_of_the_Day-_4-20_(34163554775)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Photo%20of%20the%20Day-%204-20%20%2834163554775%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Phil Jackson": {
      "title": "Phil%20Jackson%203%20cropped.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Phil_Jackson_3_cropped.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Phil%20Jackson%203%20cropped.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Gregg Popovich": {
      "title": "Gregg%20Popovich%20speaks%20at%20the%20White%20House%202015-01-12%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Gregg_Popovich_speaks_at_the_White_House_2015-01-12_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Gregg%20Popovich%20speaks%20at%20the%20White%20House%202015-01-12%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Vince Lombardi": {
      "title": "Vince%20Lombardi%20%281913-1970%29%20in%201964.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Vince_Lombardi_(1913-1970)_in_1964.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Vince%20Lombardi%20%281913-1970%29%20in%201964.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Steve Jobs": {
      "title": "Steve%20Jobs%20Headshot%202010-CROP2.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Jobs_Headshot_2010-CROP2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Steve%20Jobs%20Headshot%202010-CROP2.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Nick Saban": {
      "title": "Nick%20Saban%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Nick_Saban_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Nick%20Saban%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Henry Ford": {
      "title": "Henry%20ford%201919.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Henry_ford_1919.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Henry%20ford%201919.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "John D. Rockefeller": {
      "title": "John-D-Rockefeller-sen.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/John-D-Rockefeller-sen.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/John-D-Rockefeller-sen.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Warren Buffett": {
      "title": "Warren%20Buffett%20KU%20Visit.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Warren_Buffett_KU_Visit.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Warren%20Buffett%20KU%20Visit.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "J. Robert Oppenheimer": {
      "title": "J. Robert Oppenheimer",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Oppenheimer_%28cropped%29.jpg/330px-Oppenheimer_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/J._Robert_Oppenheimer",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Mahatma Gandhi": {
      "title": "Funchal%2C%20Mahatma%20Gandhi%20by%20Ram%20Vanji%20Sutar.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Funchal%2C_Mahatma_Gandhi_by_Ram_Vanji_Sutar.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Funchal%2C%20Mahatma%20Gandhi%20by%20Ram%20Vanji%20Sutar.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Martin Luther King Jr.": {
      "title": "The%20Rev.%20Dr.%20Martin%20Luther%20King%20Jr.%20Color%20Portrait%20%28high%20quality%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/The_Rev._Dr._Martin_Luther_King_Jr._Color_Portrait_(high_quality).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/The%20Rev.%20Dr.%20Martin%20Luther%20King%20Jr.%20Color%20Portrait%20%28high%20quality%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Nelson Mandela": {
      "title": "Nelson%20Mandela%201994.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Nelson_Mandela_1994.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Nelson%20Mandela%201994.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Joseph Stalin": {
      "title": "StalinCropped1943.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/StalinCropped1943.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/StalinCropped1943.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Vladimir Lenin": {
      "title": "Vladimir%20Lenin%20in%20July%201920%20by%20Pavel%20Zhukov.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Vladimir_Lenin_in_July_1920_by_Pavel_Zhukov.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Vladimir%20Lenin%20in%20July%201920%20by%20Pavel%20Zhukov.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Donald Trump": {
      "title": "Donald%20Trump%20%28Buffalo%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Donald_Trump_(Buffalo).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Donald%20Trump%20%28Buffalo%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "John F. Kennedy": {
      "title": "John%20F.%20Kennedy%2C%20White%20House%20color%20photo%20portrait.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/John_F._Kennedy%2C_White_House_color_photo_portrait.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/John%20F.%20Kennedy%2C%20White%20House%20color%20photo%20portrait.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Barack Obama": {
      "title": "President%20Barack%20Obama.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/President_Barack_Obama.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/President%20Barack%20Obama.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Adolf Hitler": {
      "title": "Adolf%20Hitler%20cropped%20restored%203x4.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Adolf_Hitler_cropped_restored_3x4.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Adolf%20Hitler%20cropped%20restored%203x4.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mao Zedong": {
      "title": "Mao%20Tse%20Tung.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mao_Tse_Tung.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Mao%20Tse%20Tung.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Brett Favre": {
      "title": "Brett%20Favre%20at%20Florham%20Park%2011-7-08%20081107-N-2022D-033%20crop.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Brett_Favre_at_Florham_Park_11-7-08_081107-N-2022D-033_crop.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Brett%20Favre%20at%20Florham%20Park%2011-7-08%20081107-N-2022D-033%20crop.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Steph Curry": {
      "title": "Stephen%20Curry%20Shooting%20%28cropped%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Curry_Shooting_(cropped)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Stephen%20Curry%20Shooting%20%28cropped%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "William Tell": {
      "title": "Danise%20in%20%22William%20Tell%22%20LCCN2014715543.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Danise_in_%22William_Tell%22_LCCN2014715543.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Danise%20in%20%22William%20Tell%22%20LCCN2014715543.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ray Allen": {
      "title": "Ray%20Allen%202008-01-13.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ray_Allen_2008-01-13.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ray%20Allen%202008-01-13.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Reggie Miller": {
      "title": "Reggie%20Miller%20crop.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Reggie_Miller_crop.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Reggie%20Miller%20crop.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Satchel Paige": {
      "title": "Satchel%20Paige%20seated%20next%20to%20bleachers%20%282%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Satchel_Paige_seated_next_to_bleachers_(2).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Satchel%20Paige%20seated%20next%20to%20bleachers%20%282%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Michael Vick": {
      "title": "Michael%20Vick%20at%20Eagles%20training%20camp%202010-08-03.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Vick_at_Eagles_training_camp_2010-08-03.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Vick%20at%20Eagles%20training%20camp%202010-08-03.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Wayne Gretzky": {
      "title": "Wgretz%20%28cropped3%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Wgretz_(cropped3).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Wgretz%20%28cropped3%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "David Beckham": {
      "title": "David Beckham",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/David_Beckham_UNICEF_%28cropped2%29.jpg/330px-David_Beckham_UNICEF_%28cropped2%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/David_Beckham",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Patrick Mahomes": {
      "title": "Patrick%20Mahomes%20in%20the%20Oval%20Office%20of%20the%20White%20House%20on%20June%205%2C%202023%20-%20P20230605AS-0902%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Patrick_Mahomes_in_the_Oval_Office_of_the_White_House_on_June_5%2C_2023_-_P20230605AS-0902_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Patrick%20Mahomes%20in%20the%20Oval%20Office%20of%20the%20White%20House%20on%20June%205%2C%202023%20-%20P20230605AS-0902%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Peyton Manning": {
      "title": "Peyton%20Manning%20%2851665689271%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Peyton_Manning_(51665689271).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Peyton%20Manning%20%2851665689271%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tiger Woods": {
      "title": "Tiger%20Woods%20in%20May%202019.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tiger_Woods_in_May_2019.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tiger%20Woods%20in%20May%202019.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Adam Vinatieri": {
      "title": "Vinatieri%2C%20Adam%20%28USAF%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Vinatieri%2C_Adam_(USAF).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Vinatieri%2C%20Adam%20%28USAF%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Aaron Rodgers": {
      "title": "Aaron%20Rodgers%20Packers%20OCT2021%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Aaron_Rodgers_Packers_OCT2021_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Aaron%20Rodgers%20Packers%20OCT2021%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Magic Johnson": {
      "title": "Magic%20Johnson%20at%20SXSW%202022%20%2851958828669%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Magic_Johnson_at_SXSW_2022_(51958828669)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Magic%20Johnson%20at%20SXSW%202022%20%2851958828669%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "John Stockton": {
      "title": "John%20Stockton%202022.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Stockton_2022.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/John%20Stockton%202022.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Shohei Ohtani": {
      "title": "Shohei%20Ohtani%20on%20April%2023%2C%202024%20%282%29%2053677091634.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Shohei_Ohtani_on_April_23%2C_2024_(2)_53677091634.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Shohei%20Ohtani%20on%20April%2023%2C%202024%20%282%29%2053677091634.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "John Elway": {
      "title": "John%20Elway.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Elway.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/John%20Elway.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Randy Johnson": {
      "title": "RandyJohnson.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/RandyJohnson.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/RandyJohnson.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Larry Bird": {
      "title": "Larrybird.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Larrybird.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Larrybird.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kobe Bryant": {
      "title": "KBryant8.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/KBryant8.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/KBryant8.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dirk Nowitzki": {
      "title": "Dirk%20Nowitzki%20-%202019202181209%202019-07-21%20Champions%20for%20Charity%20-%201829%20-%20B70I1864.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dirk_Nowitzki_-_2019202181209_2019-07-21_Champions_for_Charity_-_1829_-_B70I1864.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dirk%20Nowitzki%20-%202019202181209%202019-07-21%20Champions%20for%20Charity%20-%201829%20-%20B70I1864.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Alex Ovechkin": {
      "title": "Alex%20Ovechkin%202017-05-06.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Alex_Ovechkin_2017-05-06.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Alex%20Ovechkin%202017-05-06.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Sidney Crosby": {
      "title": "Sidney%20Crosby%202019-01-06%201.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sidney_Crosby_2019-01-06_1.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Sidney%20Crosby%202019-01-06%201.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Brett Hull": {
      "title": "BrettHullStlouisventure.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/BrettHullStlouisventure.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/BrettHullStlouisventure.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jason Kidd": {
      "title": "Jason%20Kidd.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jason_Kidd.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jason%20Kidd.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Steve Nash": {
      "title": "SteveNash2014.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/SteveNash2014.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/SteveNash2014.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Luka Doncic": {
      "title": "Luka%20Doncic%20%2851914951721%29%20%28cropped1%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Luka_Doncic_(51914951721)_(cropped1).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Luka%20Doncic%20%2851914951721%29%20%28cropped1%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Nikola Jokic": {
      "title": "Nikola%20Jokic%20free%20throw%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Nikola_Jokic_free_throw_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Nikola%20Jokic%20free%20throw%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Chris Paul": {
      "title": "Chris%20Paul%20%282022%20All-Star%20Weekend%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Chris_Paul_(2022_All-Star_Weekend)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Chris%20Paul%20%282022%20All-Star%20Weekend%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Arnold Palmer": {
      "title": "YN3ArnoldPalmer.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/YN3ArnoldPalmer.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/YN3ArnoldPalmer.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Lionel Messi": {
      "title": "Leo%20Messi%20Argentina%20v%20Egypt%207%20July%202026-1.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Leo%20Messi%20Argentina%20v%20Egypt%207%20July%202026-1.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Josh Allen": {
      "title": "Josh%20Allen%20SEPT2021%20%28cropped2%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Josh_Allen_SEPT2021_(cropped2).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Josh%20Allen%20SEPT2021%20%28cropped2%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Peja Stojakovic": {
      "title": "Peja%20Stojakovic%20Mavs%20cropped.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Peja_Stojakovic_Mavs_cropped.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Peja%20Stojakovic%20Mavs%20cropped.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Doug Flutie": {
      "title": "2025%2C%20Alum02%2C%20Doug%20Flutie.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/2025%2C_Alum02%2C_Doug_Flutie.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/2025%2C%20Alum02%2C%20Doug%20Flutie.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Oscar Robertson": {
      "title": "Oscar%20Robertson%201960.jpeg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Oscar_Robertson_1960.jpeg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Oscar%20Robertson%201960.jpeg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "John Wilkes Booth": {
      "title": "John%20Wilkes%20Booth-portrait.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Wilkes_Booth-portrait.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/John%20Wilkes%20Booth-portrait.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Lee Harvey Oswald": {
      "title": "Lee%20Harvey%20Oswald%201963.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Lee_Harvey_Oswald_1963.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Lee%20Harvey%20Oswald%201963.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Gavrilo Princip": {
      "title": "Gavrilo%20Princip%2C%20cell%2C%20headshot%2C%20bw%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Gavrilo_Princip%2C_cell%2C_headshot%2C_bw_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Gavrilo%20Princip%2C%20cell%2C%20headshot%2C%20bw%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Wyatt Earp": {
      "title": "Wyatt%20Earp%20portrait.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Wyatt_Earp_portrait.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Wyatt%20Earp%20portrait.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tom Brady": {
      "title": "Tom%20Brady%202021.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tom_Brady_2021.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tom%20Brady%202021.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Joe Montana": {
      "title": "Joe%20Montana%20ESPN%20cropped2.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Joe_Montana_ESPN_cropped2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Joe%20Montana%20ESPN%20cropped2.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dan Marino": {
      "title": "Danmarino.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Danmarino.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Danmarino.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Drew Brees": {
      "title": "Drew%20Brees%20%2849396271982%29%20%281%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Drew_Brees_(49396271982)_(1).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Drew%20Brees%20%2849396271982%29%20%281%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Johnny Unitas": {
      "title": "1967%20Johnny%20Unitas.jpeg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/1967_Johnny_Unitas.jpeg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/1967%20Johnny%20Unitas.jpeg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Roger Staubach": {
      "title": "Staubach%20cowboys%20qb.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Staubach_cowboys_qb.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Staubach%20cowboys%20qb.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Joe Burrow": {
      "title": "LSU%20Football%20at%20the%20White%20House%20%2849400533066%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/LSU_Football_at_the_White_House_(49400533066)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/LSU%20Football%20at%20the%20White%20House%20%2849400533066%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Matthew Stafford": {
      "title": "Matthew%20Stafford%202015.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Matthew_Stafford_2015.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Matthew%20Stafford%202015.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Lamar Jackson": {
      "title": "Lamar%20Jackson%202020.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Lamar_Jackson_2020.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Lamar%20Jackson%202020.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Caitlin Clark": {
      "title": "Caitlin%20Clark%20Big%20Ten%20tournament%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Caitlin_Clark_Big_Ten_tournament_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Caitlin%20Clark%20Big%20Ten%20tournament%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Damian Lillard": {
      "title": "Damian%20Lillard.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Damian_Lillard.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Damian%20Lillard.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Klay Thompson": {
      "title": "Klay%20Thompson%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Klay_Thompson_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Klay%20Thompson%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kevin Durant": {
      "title": "Kevin Durant",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Kevin_Durant%2C_Paris_2024_%28cropped%29.jpg/330px-Kevin_Durant%2C_Paris_2024_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Kevin_Durant",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Sue Bird": {
      "title": "SXSW-2024-alih-OB7A0246-Sue%20Bird.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/SXSW-2024-alih-OB7A0246-Sue_Bird.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/SXSW-2024-alih-OB7A0246-Sue%20Bird.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Diana Taurasi": {
      "title": "Diana%20Taurasi%202024%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Diana_Taurasi_2024_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Diana%20Taurasi%202024%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Sabrina Ionescu": {
      "title": "Sabrina%20Ionescu%202024.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sabrina_Ionescu_2024.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Sabrina%20Ionescu%202024.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Connor McDavid": {
      "title": "Connor%20McDavid%2007042015.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Connor_McDavid_07042015.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Connor%20McDavid%2007042015.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mario Lemieux": {
      "title": "Mario%20Lemieux%202001.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mario_Lemieux_2001.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Mario%20Lemieux%202001.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Roger Federer": {
      "title": "Roger Federer",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Roger_Federer_2015_%28cropped%29.jpg/330px-Roger_Federer_2015_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Roger_Federer",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Novak Djokovic": {
      "title": "Novak Djokovic",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Novak_Djokovic_Paris_2024_Olympic_Games_%28cropped%29.jpg/330px-Novak_Djokovic_Paris_2024_Olympic_Games_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Novak_Djokovic",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Babe Ruth": {
      "title": "Babe%20Ruth%2C%201933.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Babe_Ruth%2C_1933.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Babe%20Ruth%2C%201933.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Nolan Ryan": {
      "title": "Nolan%20Ryan%20in%20Atlanta%20close-up.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Nolan_Ryan_in_Atlanta_close-up.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Nolan%20Ryan%20in%20Atlanta%20close-up.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Pedro Martinez": {
      "title": "Pedro%20Mart%C3%ADnez%20on%20September%208%2C%202009.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pedro_Mart%C3%ADnez_on_September_8%2C_2009.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Pedro%20Mart%C3%ADnez%20on%20September%208%2C%202009.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tracy McGrady": {
      "title": "Tracy%20McGrady%201.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tracy_McGrady_1.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tracy%20McGrady%201.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "James Harden": {
      "title": "Harden%20dribbling%20midcourt%2C%20Cavaliers%20vs%20Nets%20on%20January%2017%2C%202022%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Harden_dribbling_midcourt%2C_Cavaliers_vs_Nets_on_January_17%2C_2022_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Harden%20dribbling%20midcourt%2C%20Cavaliers%20vs%20Nets%20on%20January%2017%2C%202022%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Carmelo Anthony": {
      "title": "Carmelo%20Anthony%20-%2051958670372%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Carmelo_Anthony_-_51958670372_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Carmelo%20Anthony%20-%2051958670372%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Steve Young": {
      "title": "Steve%20Young%20%286837509849%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Young_(6837509849)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Steve%20Young%20%286837509849%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Warren Moon": {
      "title": "Halo3LaunchInSeattle%20WarrenMoon.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Halo3LaunchInSeattle_WarrenMoon.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Halo3LaunchInSeattle%20WarrenMoon.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Terry Bradshaw": {
      "title": "Terry%20Bradshaw.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Terry_Bradshaw.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Terry%20Bradshaw.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ben Roethlisberger": {
      "title": "Ben%20Roethlisberger.JPG",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ben_Roethlisberger.JPG?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ben%20Roethlisberger.JPG",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Philip Rivers": {
      "title": "Philip%20Rivers%202017.JPG",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Philip_Rivers_2017.JPG?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Philip%20Rivers%202017.JPG",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Eli Manning": {
      "title": "Eli%20Manning%20US%20govt.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Eli_Manning_US_govt.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Eli%20Manning%20US%20govt.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dak Prescott": {
      "title": "Dak%20Prescott%20WAS%20%40%20DAL%202021%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dak_Prescott_WAS_%40_DAL_2021_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dak%20Prescott%20WAS%20%40%20DAL%202021%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jalen Hurts": {
      "title": "Jalen%20Hurts%2011-14-22%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jalen_Hurts_11-14-22_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jalen%20Hurts%2011-14-22%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Justin Herbert": {
      "title": "Justin%20Herbert%202021.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Justin_Herbert_2021.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Justin%20Herbert%202021.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Russell Wilson": {
      "title": "Russell%20Wilson%20at%20the%202013%20Jessie%20Vetter%20Classic%2C%20July%201%2C%202013.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Russell_Wilson_at_the_2013_Jessie_Vetter_Classic%2C_July_1%2C_2013.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Russell%20Wilson%20at%20the%202013%20Jessie%20Vetter%20Classic%2C%20July%201%2C%202013.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Cam Newton": {
      "title": "Cam%20Newton%20-%20Carolina%20Panthers.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Cam_Newton_-_Carolina_Panthers.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Cam%20Newton%20-%20Carolina%20Panthers.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Vince Carter": {
      "title": "Vince%20Carter%202013-03-25%20%281%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Vince_Carter_2013-03-25_(1).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Vince%20Carter%202013-03-25%20%281%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Paul Pierce": {
      "title": "Paul%20Pierce%202008-01-13%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Paul_Pierce_2008-01-13_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Paul%20Pierce%202008-01-13%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Devin Booker": {
      "title": "2025-01-05%20ALBA%20Berlin%20gegen%20FC%20Bayern%20M%C3%BCnchen%20%28Basketball-Bundesliga%202024-25%29%20by%20Sandro%20Halank%E2%80%93056.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/2025-01-05_ALBA_Berlin_gegen_FC_Bayern_M%C3%BCnchen_(Basketball-Bundesliga_2024-25)_by_Sandro_Halank%E2%80%93056.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/2025-01-05%20ALBA%20Berlin%20gegen%20FC%20Bayern%20M%C3%BCnchen%20%28Basketball-Bundesliga%202024-25%29%20by%20Sandro%20Halank%E2%80%93056.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Trae Young": {
      "title": "Trae%20Young%20%282022%20All-Star%20Weekend%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Trae_Young_(2022_All-Star_Weekend)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Trae%20Young%20%282022%20All-Star%20Weekend%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Donovan Mitchell": {
      "title": "Donovan Mitchell",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Donovan_Mitchell_Pregame.jpg/330px-Donovan_Mitchell_Pregame.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Donovan_Mitchell",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Bradley Beal": {
      "title": "Bradley%20Beal%202020.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bradley_Beal_2020.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bradley%20Beal%202020.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ray Bourque": {
      "title": "Bourque%207.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bourque_7.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bourque%207.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Auston Matthews": {
      "title": "Auston%20Matthews%209.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Auston_Matthews_9.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Auston%20Matthews%209.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Steven Stamkos": {
      "title": "Steve%20Stamkos%20-%20NHL%20Store%202011.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Stamkos_-_NHL_Store_2011.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Steve%20Stamkos%20-%20NHL%20Store%202011.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jaromir Jagr": {
      "title": "Jagr%20Panthers.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jagr_Panthers.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jagr%20Panthers.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Roger Clemens": {
      "title": "Roger%20clemens%202004.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Roger_clemens_2004.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Roger%20clemens%202004.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Greg Maddux": {
      "title": "Greg%20Maddux%202008.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Greg_Maddux_2008.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Greg%20Maddux%202008.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tom Seaver": {
      "title": "Tom%20Seaver%202011.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tom_Seaver_2011.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tom%20Seaver%202011.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bob Gibson": {
      "title": "Bob%20Gibson%20c%201960%20%28JJH%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bob_Gibson_c_1960_(JJH).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bob%20Gibson%20c%201960%20%28JJH%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mariano Rivera": {
      "title": "Mariano%20Rivera%20allison%207%2029%2007.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mariano_Rivera_allison_7_29_07.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Mariano%20Rivera%20allison%207%2029%2007.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Justin Verlander": {
      "title": "Justin%20Verlander%20pitching%2C%20March%2026%2C%202023%20%281%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Justin_Verlander_pitching%2C_March_26%2C_2023_(1)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Justin%20Verlander%20pitching%2C%20March%2026%2C%202023%20%281%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Max Scherzer": {
      "title": "Max%20Scherzer%20pitching%2C%20March%2030%2C%202023%20%281%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Max_Scherzer_pitching%2C_March_30%2C_2023_(1)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Max%20Scherzer%20pitching%2C%20March%2030%2C%202023%20%281%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "CC Sabathia": {
      "title": "CCSabathia.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/CCSabathia.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/CCSabathia.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jack Nicklaus": {
      "title": "JackNicklausMedalOfFreedom.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/JackNicklausMedalOfFreedom.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/JackNicklausMedalOfFreedom.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Phil Mickelson": {
      "title": "Phil%20Mickelson%2014.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Phil_Mickelson_14.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Phil%20Mickelson%2014.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Rory McIlroy": {
      "title": "Rory%20McIlroy%20Ryder%20Cup%202025-195%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rory_McIlroy_Ryder_Cup_2025-195_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Rory%20McIlroy%20Ryder%20Cup%202025-195%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bryson DeChambeau": {
      "title": "Bryson%20DeChambeau%20in%202025%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bryson_DeChambeau_in_2025_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bryson%20DeChambeau%20in%202025%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Brooks Koepka": {
      "title": "Brooks%20Koepka%20Portrait.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Brooks_Koepka_Portrait.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Brooks%20Koepka%20Portrait.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jesse Owens": {
      "title": "Jesse%20Owens%201936.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jesse_Owens_1936.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jesse%20Owens%201936.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Harriet Tubman": {
      "title": "Harriet%20Tubman%20%28circa%201885%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Harriet_Tubman_(circa_1885).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Harriet%20Tubman%20%28circa%201885%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jim Thorpe": {
      "title": "Jim%20Thorpe%201910s2.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jim_Thorpe_1910s2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jim%20Thorpe%201910s2.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Usain Bolt": {
      "title": "Usain%20Bolt%20Rio%20100m%20final%202016k.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Usain_Bolt_Rio_100m_final_2016k.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Usain%20Bolt%20Rio%20100m%20final%202016k.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Paul Revere": {
      "title": "J%20S%20Copley%20-%20Paul%20Revere.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/J_S_Copley_-_Paul_Revere.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/J%20S%20Copley%20-%20Paul%20Revere.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bo Jackson": {
      "title": "Bo%20Jackson%2C%202011%20NCAA%20Honors%20Celebration%2C%20San%20Antonio%2C%20TX.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bo_Jackson%2C_2011_NCAA_Honors_Celebration%2C_San_Antonio%2C_TX.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bo%20Jackson%2C%202011%20NCAA%20Honors%20Celebration%2C%20San%20Antonio%2C%20TX.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "LaDainian Tomlinson": {
      "title": "LaDainian%20Tomlinson%202017%20closeup.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/LaDainian_Tomlinson_2017_closeup.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/LaDainian%20Tomlinson%202017%20closeup.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Derrick Henry": {
      "title": "Derrick%20Henry%20OCT2022%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Derrick_Henry_OCT2022_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Derrick%20Henry%20OCT2022%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Russell Westbrook": {
      "title": "Russell%20Westbrook%20%28March%2021%2C%202022%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Russell_Westbrook_(March_21%2C_2022)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Russell%20Westbrook%20%28March%2021%2C%202022%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Allen Iverson": {
      "title": "Allen%20Iverson%20headshot.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Allen_Iverson_headshot.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Allen%20Iverson%20headshot.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jerry Rice": {
      "title": "Super%20Bowl%2044%20Miami%20Florida%20NFL%20Network%20South%20Beach%20Set%20Deon%20Sanders%20interviews%20Jerry%20Rice%20%284331549867%29%20%28cropped%29%20-%20Jerry%20Rice.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Super_Bowl_44_Miami_Florida_NFL_Network_South_Beach_Set_Deon_Sanders_interviews_Jerry_Rice_(4331549867)_(cropped)_-_Jerry_Rice.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Super%20Bowl%2044%20Miami%20Florida%20NFL%20Network%20South%20Beach%20Set%20Deon%20Sanders%20interviews%20Jerry%20Rice%20%284331549867%29%20%28cropped%29%20-%20Jerry%20Rice.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Terrell Owens": {
      "title": "Terrell%20Owens%202017-05-02%20%2834255853692%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Terrell_Owens_2017-05-02_(34255853692)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Terrell%20Owens%202017-05-02%20%2834255853692%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Carl Lewis": {
      "title": "Save%20The%20World%20Awards%202009%20show06%20-%20Carl%20Lewis.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Save_The_World_Awards_2009_show06_-_Carl_Lewis.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Save%20The%20World%20Awards%202009%20show06%20-%20Carl%20Lewis.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Randy Moss": {
      "title": "Randy%20Moss%202016.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Randy_Moss_2016.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Randy%20Moss%202016.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "LeBron James": {
      "title": "LeBron%20James%20Lakers.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/LeBron_James_Lakers.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/LeBron%20James%20Lakers.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Michael Jordan": {
      "title": "Michael%20Jordan%20in%202014.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Jordan_in_2014.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Jordan%20in%202014.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Calvin Johnson": {
      "title": "Calvin%20Johnson%20%28cropped%29.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Calvin_Johnson_(cropped).png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Calvin%20Johnson%20%28cropped%29.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Barry Sanders": {
      "title": "BarrySanders.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/BarrySanders.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/BarrySanders.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Adrian Peterson": {
      "title": "Adrian%20Peterson%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Adrian_Peterson_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Adrian%20Peterson%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kyrie Irving": {
      "title": "Kyrie%20Irving%20-%2051831823383.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kyrie_Irving_-_51831823383.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Kyrie%20Irving%20-%2051831823383.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Giannis Antetokounmpo": {
      "title": "Giannis%20Antetokounmpo%20%2851915153421%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Giannis_Antetokounmpo_(51915153421)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Giannis%20Antetokounmpo%20%2851915153421%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kawhi Leonard": {
      "title": "1%20kawhi%20leonard%202019%20nba%20finals%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/1_kawhi_leonard_2019_nba_finals_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/1%20kawhi%20leonard%202019%20nba%20finals%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Deion Sanders": {
      "title": "Deion Sanders",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9f/Deion_Sanders_%288216060%29_%28cropped%29.jpg/330px-Deion_Sanders_%288216060%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Deion_Sanders",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Charles Woodson": {
      "title": "Charles Woodson",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Charles_Woodson_2014_2.JPG/330px-Charles_Woodson_2014_2.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Charles_Woodson",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Ichiro Suzuki": {
      "title": "Ichiro Suzuki",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Ichiro_Suzuki_%2851007034081%29_%28cropped%29.jpg/330px-Ichiro_Suzuki_%2851007034081%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Ichiro_Suzuki",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Cristiano Ronaldo": {
      "title": "Cristiano Ronaldo",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg/330px-Cristiano_Ronaldo_Croatia_v_Portugal_2_July_2026-075_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Cristiano_Ronaldo",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Simone Biles": {
      "title": "Simone Biles",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Simone_Biles_National_Team_2024.jpg/330px-Simone_Biles_National_Team_2024.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Simone_Biles",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Michael Phelps": {
      "title": "Michael Phelps",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Michael_Phelps_Rio_Olympics_2016.jpg/330px-Michael_Phelps_Rio_Olympics_2016.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Michael_Phelps",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Serena Williams": {
      "title": "Serena Williams",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Serena-Smiling-2020.png/330px-Serena-Smiling-2020.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Serena_Williams",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Derek Jeter": {
      "title": "Derek Jeter",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Derek_Jeter_during_MLB_on_Fox_pre-game_show%2C_October_16%2C_2024_-_001_%28cropped%29.jpg/330px-Derek_Jeter_during_MLB_on_Fox_pre-game_show%2C_October_16%2C_2024_-_001_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Derek_Jeter",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Ken Griffey Jr.": {
      "title": "Ken Griffey Jr.",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Ken_Griffey%2C_Jr._June_2009_%28cropped%29.jpg/330px-Ken_Griffey%2C_Jr._June_2009_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Ken_Griffey_Jr.",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Reggie Bush": {
      "title": "Reggie Bush",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Reggie_Bush_by_Gage_Skidmore.jpg/330px-Reggie_Bush_by_Gage_Skidmore.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Reggie_Bush",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Derrick Rose": {
      "title": "Derrick%20Rose%20%2837670935991%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Derrick_Rose_(37670935991).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Derrick%20Rose%20%2837670935991%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Devin Hester": {
      "title": "Devin%20Hester%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Devin_Hester_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Devin%20Hester%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Desmond Howard": {
      "title": "DesmondHoward.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/DesmondHoward.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/DesmondHoward.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ricky Williams": {
      "title": "Ricky%20Williams%20February%202020.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ricky_Williams_February_2020.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ricky%20Williams%20February%202020.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "OJ Simpson": {
      "title": "O.J.%20Simpson%201990%20%C2%B7%20DN-ST-91-03444%20crop.JPEG",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/O.J._Simpson_1990_%C2%B7_DN-ST-91-03444_crop.JPEG?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/O.J.%20Simpson%201990%20%C2%B7%20DN-ST-91-03444%20crop.JPEG",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Michael Irvin": {
      "title": "Michael%20Irvin.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Irvin.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Irvin.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Saquon Barkley": {
      "title": "Saquon%20Barkley%202018.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Saquon_Barkley_2018.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Saquon%20Barkley%202018.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Christian McCaffrey": {
      "title": "Christian%20McCaffrey%202019.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Christian_McCaffrey_2019.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Christian%20McCaffrey%202019.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Marshawn Lynch": {
      "title": "Marshawn%20Lynch%202011.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Marshawn_Lynch_2011.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Marshawn%20Lynch%202011.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Travis Kelce": {
      "title": "Travis%20Kelce%20in%20the%20Oval%20Office%20of%20the%20White%20House%20on%20June%205%2C%202023%20-%20P20230605AS-0902%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Travis_Kelce_in_the_Oval_Office_of_the_White_House_on_June_5%2C_2023_-_P20230605AS-0902_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Travis%20Kelce%20in%20the%20Oval%20Office%20of%20the%20White%20House%20on%20June%205%2C%202023%20-%20P20230605AS-0902%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tony Hawk": {
      "title": "Tony%20Hawk%20in%202023.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tony_Hawk_in_2023.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tony%20Hawk%20in%202023.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Shaun White": {
      "title": "Shaun%20White%20in%202018%20181222-D-PB383-014%20%2846423162561%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Shaun_White_in_2018_181222-D-PB383-014_(46423162561)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Shaun%20White%20in%202018%20181222-D-PB383-014%20%2846423162561%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Sha'Carri Richardson": {
      "title": "Sha%27Carri%20Richardson%2015555%20%28sq%20cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sha'Carri_Richardson_15555_(sq_cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Sha%27Carri%20Richardson%2015555%20%28sq%20cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Pele": {
      "title": "Pele%20by%20David%20Howard%20Hitchcock%2C%20c.%201929.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pele_by_David_Howard_Hitchcock%2C_c._1929.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Pele%20by%20David%20Howard%20Hitchcock%2C%20c.%201929.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Neymar": {
      "title": "Neymar%20Junior%20Brazil%20V%20Morocco%2013%20June%202026-40.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Neymar_Junior_Brazil_V_Morocco_13_June_2026-40.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Neymar%20Junior%20Brazil%20V%20Morocco%2013%20June%202026-40.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kylian Mbappe": {
      "title": "Kylian%20Mbappe%20France%20v%20Senegal%2016%20June%202026-391%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbappe_France_v_Senegal_16_June_2026-391_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Kylian%20Mbappe%20France%20v%20Senegal%2016%20June%202026-391%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Thierry Henry": {
      "title": "Thierry%20Henry%20%2851649035951%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Thierry_Henry_(51649035951)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Thierry%20Henry%20%2851649035951%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mia Hamm": {
      "title": "Mia%20Hamm%202010%20cropped.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mia_Hamm_2010_cropped.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Mia%20Hamm%202010%20cropped.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Alex Morgan": {
      "title": "NC%20Courage%20v%20San%20Diego%20Wave%20%28Oct%202023%29%20014%20%28Morgan%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/NC_Courage_v_San_Diego_Wave_(Oct_2023)_014_(Morgan).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/NC%20Courage%20v%20San%20Diego%20Wave%20%28Oct%202023%29%20014%20%28Morgan%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tyreek Hill": {
      "title": "Tyreek%20Hill%20OCT2021%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tyreek_Hill_OCT2021_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tyreek%20Hill%20OCT2021%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Walter Payton": {
      "title": "1986%20Jeno%27s%20Pizza%20-%2012%20-%20Walter%20Payton%20%28Walter%20Payton%20crop%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/1986_Jeno's_Pizza_-_12_-_Walter_Payton_(Walter_Payton_crop).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/1986%20Jeno%27s%20Pizza%20-%2012%20-%20Walter%20Payton%20%28Walter%20Payton%20crop%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Odell Beckham Jr.": {
      "title": "Odell%20Beckham%20Jr.%20%2851402744025%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Odell_Beckham_Jr._(51402744025)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Odell%20Beckham%20Jr.%20%2851402744025%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Emmitt Smith": {
      "title": "EmmittSmith2007.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/EmmittSmith2007.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/EmmittSmith2007.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Marshall Faulk": {
      "title": "Marshall%20Faulk%20by%20Gage%20Skidmore.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Marshall_Faulk_by_Gage_Skidmore.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Marshall%20Faulk%20by%20Gage%20Skidmore.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Eric Dickerson": {
      "title": "Eric%20Dickerson-August%202010.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Eric_Dickerson-August_2010.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Eric%20Dickerson-August%202010.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Chris Johnson": {
      "title": "Chris%20Johnson%20%28cornerback%29.JPG",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Chris_Johnson_(cornerback).JPG?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Chris%20Johnson%20%28cornerback%29.JPG",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Rickey Henderson": {
      "title": "Rickeyhenderson2002.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rickeyhenderson2002.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Rickeyhenderson2002.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dale Earnhardt": {
      "title": "Dale%20Earnhardt%20visits%20Langley%20AFB.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dale_Earnhardt_visits_Langley_AFB.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dale%20Earnhardt%20visits%20Langley%20AFB.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jackie Robinson": {
      "title": "Jackie%20Robinson%2C%20NPG%2097%20135.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jackie_Robinson%2C_NPG_97_135.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jackie%20Robinson%2C%20NPG%2097%20135.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Katie Ledecky": {
      "title": "Katie%20Ledecky%20at%20the%202023%20Golden%20Goggle%20Awards%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Katie_Ledecky_at_the_2023_Golden_Goggle_Awards_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Katie%20Ledecky%20at%20the%202023%20Golden%20Goggle%20Awards%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jackie Chan": {
      "title": "Jackie%20Chan%20-%202025%20Locarno%20Film%20Festival.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jackie_Chan_-_2025_Locarno_Film_Festival.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jackie%20Chan%20-%202025%20Locarno%20Film%20Festival.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bruce Lee": {
      "title": "Bruce%20Lee%201973%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bruce_Lee_1973_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bruce%20Lee%201973%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Sacagawea": {
      "title": "GPS%20Block%20IIIA%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/GPS_Block_IIIA_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/GPS%20Block%20IIIA%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Amelia Earhart": {
      "title": "Amelia%20Earhart%201935.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Amelia_Earhart_1935.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Amelia%20Earhart%201935.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Steve Smith Sr.": {
      "title": "Steve%20Smith%20Sr.%202015%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Smith_Sr._2015_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Steve%20Smith%20Sr.%202015%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Julio Jones": {
      "title": "Julio%20Jones%202018.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Julio_Jones_2018.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Julio%20Jones%202018.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Larry Fitzgerald": {
      "title": "Larry%20Fitzgerald%202017.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Larry_Fitzgerald_2017.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Larry%20Fitzgerald%202017.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Antonio Brown": {
      "title": "Antonio%20Browns%20%28born%201978%29%20WAS%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Antonio_Browns_(born_1978)_WAS_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Antonio%20Browns%20%28born%201978%29%20WAS%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Cooper Kupp": {
      "title": "Cooper%20Kupp.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Cooper_Kupp.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Cooper%20Kupp.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Justin Jefferson": {
      "title": "Jefferson%202022.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jefferson_2022.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jefferson%202022.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ja'Marr Chase": {
      "title": "Ja%27Marr%20Chase.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ja'Marr_Chase.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ja%27Marr%20Chase.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "DK Metcalf": {
      "title": "D.K.%20Metcalf%202020.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/D.K._Metcalf_2020.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/D.K.%20Metcalf%202020.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ezekiel Elliott": {
      "title": "EzekielElliott.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/EzekielElliott.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/EzekielElliott.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Alvin Kamara": {
      "title": "Mr.%20Kamara.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mr._Kamara.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Mr.%20Kamara.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jamaal Charles": {
      "title": "Jamaal%20Charles.JPG",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jamaal_Charles.JPG?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jamaal%20Charles.JPG",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Thurman Thomas": {
      "title": "Thurman%20Thomas%20ESPNWeekend2010-067.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Thurman_Thomas_ESPNWeekend2010-067.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Thurman%20Thomas%20ESPNWeekend2010-067.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Franco Harris": {
      "title": "Franco%20Harris%20-%20PA%20Democrat%20Party%20-%20Jan%2022%202009.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Franco_Harris_-_PA_Democrat_Party_-_Jan_22_2009.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Franco%20Harris%20-%20PA%20Democrat%20Party%20-%20Jan%2022%202009.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Earl Campbell": {
      "title": "Earl%20campbell%20shaggybevo.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Earl_campbell_shaggybevo.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Earl%20campbell%20shaggybevo.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tony Dorsett": {
      "title": "Tony%20Dorsett.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tony_Dorsett.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tony%20Dorsett.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Marcus Allen": {
      "title": "Pro%20Football%20Hall%20of%20Famer%20Speaks%20at%20Award%20Ceremony%20130104-A-GX635-439%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pro_Football_Hall_of_Famer_Speaks_at_Award_Ceremony_130104-A-GX635-439_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Pro%20Football%20Hall%20of%20Famer%20Speaks%20at%20Award%20Ceremony%20130104-A-GX635-439%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Darren Sproles": {
      "title": "Darren%20Sproles.JPG",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Darren_Sproles.JPG?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Darren%20Sproles.JPG",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Venus Williams": {
      "title": "Venus%20Williams%20%2814948553428%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Venus_Williams_(14948553428).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Venus%20Williams%20%2814948553428%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Naomi Osaka": {
      "title": "Naomi%20Osaka%202017%20Wimbledon.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Naomi_Osaka_2017_Wimbledon.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Naomi%20Osaka%202017%20Wimbledon.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Coco Gauff": {
      "title": "Coco%20Gauff%20Miami%20Open.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Coco_Gauff_Miami_Open.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Coco%20Gauff%20Miami%20Open.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Steffi Graf": {
      "title": "Steffi%20Graf%20in%20Hamburg%202010%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Steffi_Graf_in_Hamburg_2010_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Steffi%20Graf%20in%20Hamburg%202010%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Martina Navratilova": {
      "title": "Tennis%20Nederland%20tegen%20Verenigde%20Staten%20in%20Den%20Haag%20Navratilova%20in%20aktie%2C%20Bestanddeelnr%20930-9118%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tennis_Nederland_tegen_Verenigde_Staten_in_Den_Haag_Navratilova_in_aktie%2C_Bestanddeelnr_930-9118_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tennis%20Nederland%20tegen%20Verenigde%20Staten%20in%20Den%20Haag%20Navratilova%20in%20aktie%2C%20Bestanddeelnr%20930-9118%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Billie Jean King": {
      "title": "Billie%20Jean%20King%20at%20the%202026%20Sundance%20Film%20Festival%2002%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Billie_Jean_King_at_the_2026_Sundance_Film_Festival_02_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Billie%20Jean%20King%20at%20the%202026%20Sundance%20Film%20Festival%2002%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ronaldinho": {
      "title": "Sports%20Festival%202025%20-%204%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sports_Festival_2025_-_4_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Sports%20Festival%202025%20-%204%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Diego Maradona": {
      "title": "Argentina%20celebrando%20copa%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Argentina_celebrando_copa_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Argentina%20celebrando%20copa%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Zinedine Zidane": {
      "title": "Zinedine%20Zidane%20by%20Tasnim%2003.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Zinedine_Zidane_by_Tasnim_03.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Zinedine%20Zidane%20by%20Tasnim%2003.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Gareth Bale": {
      "title": "2022%20FIFA%20World%20Cup%20United%20States%201%E2%80%931%20Wales%20-%20%2832%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/2022_FIFA_World_Cup_United_States_1%E2%80%931_Wales_-_(32)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/2022%20FIFA%20World%20Cup%20United%20States%201%E2%80%931%20Wales%20-%20%2832%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Fernando Tatis Jr.": {
      "title": "Padres%20Visit%203rd%20MAW%20Marines%20at%20Miramar%20%282%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Padres_Visit_3rd_MAW_Marines_at_Miramar_(2)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Padres%20Visit%203rd%20MAW%20Marines%20at%20Miramar%20%282%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mookie Betts": {
      "title": "Dodgers%20at%20Nationals%20%2853676957188%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dodgers_at_Nationals_(53676957188)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dodgers%20at%20Nationals%20%2853676957188%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tony Gwynn": {
      "title": "Tony%20Gwynn%202011.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tony_Gwynn_2011.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tony%20Gwynn%202011.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Roberto Clemente": {
      "title": "1962%20Baseball%20Guide.p21.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/1962_Baseball_Guide.p21.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/1962%20Baseball%20Guide.p21.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jeff Gordon": {
      "title": "Jeff%20gordon%20%2847223209121%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jeff_gordon_(47223209121).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jeff%20gordon%20%2847223209121%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Danica Patrick": {
      "title": "AmericaFest%202025%20-%20Danica%20Patrick%2002%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/AmericaFest_2025_-_Danica_Patrick_02_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/AmericaFest%202025%20-%20Danica%20Patrick%2002%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Evel Knievel": {
      "title": "At%20Home%20With%20Evel%20Knievel.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/At_Home_With_Evel_Knievel.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/At%20Home%20With%20Evel%20Knievel.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Muhammad Ali": {
      "title": "Muhammad%20Ali%2C%20gtfy.00140.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Muhammad_Ali%2C_gtfy.00140.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Muhammad%20Ali%2C%20gtfy.00140.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Brock Lesnar": {
      "title": "Brock Lesnar",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Brock_Lesnar_At_SummerSlam_2023_%28cropped%29.jpg/330px-Brock_Lesnar_At_SummerSlam_2023_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Brock_Lesnar",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Hulk Hogan": {
      "title": "Hulk%20Hogan%2C%20circa%201985.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Hulk_Hogan%2C_circa_1985.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Hulk%20Hogan%2C%20circa%201985.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "The Undertaker": {
      "title": "The%20Undertaker%20US%20Marine%20Visit%202019%20%28cropped%292.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/The_Undertaker_US_Marine_Visit_2019_(cropped)2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/The%20Undertaker%20US%20Marine%20Visit%202019%20%28cropped%292.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "\"Stone Cold\" Steve Austin": {
      "title": "Steve%20Austin%20by%20Gage%20Skidmore.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Austin_by_Gage_Skidmore.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Steve%20Austin%20by%20Gage%20Skidmore.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Aaron Donald": {
      "title": "Aaron%20Donald%202014%20combine.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Aaron_Donald_2014_combine.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Aaron%20Donald%202014%20combine.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Reggie White": {
      "title": "Reggie%20White%20at%20the%20White%20House%20Crop.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Reggie_White_at_the_White_House_Crop.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Reggie%20White%20at%20the%20White%20House%20Crop.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Lawrence Taylor": {
      "title": "Lawrence%20Taylor%20in%202025%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Lawrence_Taylor_in_2025_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Lawrence%20Taylor%20in%202025%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ray Lewis": {
      "title": "Ray%20Lewis%20at%20Andrews%20AFB%20070821-F-0000J-002%20crop.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ray_Lewis_at_Andrews_AFB_070821-F-0000J-002_crop.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ray%20Lewis%20at%20Andrews%20AFB%20070821-F-0000J-002%20crop.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mike Tyson": {
      "title": "Mike%20Tyson%20Cardinals.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mike_Tyson_Cardinals.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Mike%20Tyson%20Cardinals.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "George Foreman": {
      "title": "George%20Foreman%20%281973%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/George_Foreman_(1973).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/George%20Foreman%20%281973%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Francis Ngannou": {
      "title": "Francis%20Ngannou%202023%20%28cropped%29.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Francis_Ngannou_2023_(cropped).png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Francis%20Ngannou%202023%20%28cropped%29.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Andre the Giant": {
      "title": "Andr%C3%A9%20the%20Giant%20and%20Bam%20Bam%20Bigelow%2C%20circa%201988.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Andr%C3%A9_the_Giant_and_Bam_Bam_Bigelow%2C_circa_1988.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Andr%C3%A9%20the%20Giant%20and%20Bam%20Bam%20Bigelow%2C%20circa%201988.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Joe Thomas": {
      "title": "Joe Thomas Cleveland Browns.jpg",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Joe_Thomas_Cleveland_Browns.jpg/330px-Joe_Thomas_Cleveland_Browns.jpg",
      "pageUrl": "https://commons.wikimedia.org/wiki/File:Joe_Thomas_Cleveland_Browns.jpg",
      "source": "Wikimedia Commons manual correction"
    },
    "Orlando Pace": {
      "title": "Orlando%20Pace.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Orlando_Pace.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Orlando%20Pace.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Anthony Munoz": {
      "title": "Anthony%20Mu%C3%B1oz.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Anthony_Mu%C3%B1oz.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Anthony%20Mu%C3%B1oz.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "J. J. Watt": {
      "title": "JJWatt.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/JJWatt.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/JJWatt.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Warren Sapp": {
      "title": "Warren%20Sapp%20at%202010%20Pro%20Bowl%20-%20cropped.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Warren_Sapp_at_2010_Pro_Bowl_-_cropped.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Warren%20Sapp%20at%202010%20Pro%20Bowl%20-%20cropped.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Michael Strahan": {
      "title": "Michael%20Strahan%202022%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Strahan_2022_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Strahan%202022%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Myles Garrett": {
      "title": "Myles%20Garrett%20%282021%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Myles_Garrett_(2021).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Myles%20Garrett%20%282021%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Quinton \"Rampage\" Jackson": {
      "title": "02-09JUL2019%20CNGB%20USO%20Tour%202019%20190705-F-WH816-1016%20%2848531457487%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/02-09JUL2019_CNGB_USO_Tour_2019_190705-F-WH816-1016_(48531457487)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/02-09JUL2019%20CNGB%20USO%20Tour%202019%20190705-F-WH816-1016%20%2848531457487%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kimbo Slice": {
      "title": "Kimbo%20Slice%201.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kimbo_Slice_1.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Kimbo%20Slice%201.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Brian Urlacher": {
      "title": "Brian%20Urlacher%20crop2.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Brian_Urlacher_crop2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Brian%20Urlacher%20crop2.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dick Butkus": {
      "title": "Dickbutkus.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dickbutkus.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dickbutkus.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Zydrunas Savickas": {
      "title": "Zydrunas%20Savickas%202010.JPG",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Zydrunas_Savickas_2010.JPG?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Zydrunas%20Savickas%202010.JPG",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Hafthor \"The Mountain\" Bjornsson": {
      "title": "Bj%C3%B6rnsson%20Arnold%20Classic%202017.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bj%C3%B6rnsson_Arnold_Classic_2017.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bj%C3%B6rnsson%20Arnold%20Classic%202017.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Otto von Bismarck": {
      "title": "Bundesarchiv%20Bild%20146-2005-0057%2C%20Otto%20von%20Bismarck.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bundesarchiv_Bild_146-2005-0057%2C_Otto_von_Bismarck.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bundesarchiv%20Bild%20146-2005-0057%2C%20Otto%20von%20Bismarck.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Arnold Schwarzenegger": {
      "title": "Arnold Schwarzenegger",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Arnold_Schwarzenegger_-_Austrian_World_Summit_2026_BHO-2906.jpg/330px-Arnold_Schwarzenegger_-_Austrian_World_Summit_2026_BHO-2906.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Arnold_Schwarzenegger",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Shaquille O'Neal": {
      "title": "Shaquille%20O%27Neal%20October%202017%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Shaquille_O'Neal_October_2017_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Shaquille%20O%27Neal%20October%202017%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ben Wallace": {
      "title": "Official%20portrait%20of%20Rt%20Hon%20Ben%20Wallace%20MP%20crop%202.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Official_portrait_of_Rt_Hon_Ben_Wallace_MP_crop_2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Official%20portrait%20of%20Rt%20Hon%20Ben%20Wallace%20MP%20crop%202.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tim Duncan": {
      "title": "Tim%20Duncan.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tim_Duncan.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tim%20Duncan.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Hakeem Olajuwon": {
      "title": "Nigerian%20President%20Buhari%20Stands%20With%20Secretary%20Kerry%2C%20U.S.%20Delegation%20After%20They%20Attended%20His%20Inauguration%20Ceremony%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Nigerian_President_Buhari_Stands_With_Secretary_Kerry%2C_U.S._Delegation_After_They_Attended_His_Inauguration_Ceremony_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Nigerian%20President%20Buhari%20Stands%20With%20Secretary%20Kerry%2C%20U.S.%20Delegation%20After%20They%20Attended%20His%20Inauguration%20Ceremony%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bill Russell": {
      "title": "Bill%20russell%20dribbling%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bill_russell_dribbling_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bill%20russell%20dribbling%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kareem Abdul-Jabbar": {
      "title": "Kareem%20Abdul-Jabbar%20May%202014.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kareem_Abdul-Jabbar_May_2014.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Kareem%20Abdul-Jabbar%20May%202014.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Charles Barkley": {
      "title": "Charles%20Barkley%20in%202026.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Charles_Barkley_in_2026.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Charles%20Barkley%20in%202026.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Joel Embiid": {
      "title": "Joel%20Embiid%202019.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Joel_Embiid_2019.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Joel%20Embiid%202019.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dwight Howard": {
      "title": "Dwight%20Howard%20pre-game%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dwight_Howard_pre-game_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dwight%20Howard%20pre-game%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Wilt Chamberlain": {
      "title": "Wilt%20Chamberlain3.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Wilt_Chamberlain3.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Wilt%20Chamberlain3.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Victor Wembanyama": {
      "title": "Victor%20Wembanyama%20San%20Antonio%20Spurs%202024.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Victor_Wembanyama_San_Antonio_Spurs_2024.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Victor%20Wembanyama%20San%20Antonio%20Spurs%202024.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dennis Rodman": {
      "title": "Dennis%20Rodman%2002%20%2834649289162%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dennis_Rodman_02_(34649289162)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dennis%20Rodman%2002%20%2834649289162%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Rasheed Wallace": {
      "title": "Rasheed%20Wallace%202%20cropped.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rasheed_Wallace_2_cropped.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Rasheed%20Wallace%202%20cropped.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kevin Garnett": {
      "title": "Kevin%20Garnett%202008-01-13.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Kevin_Garnett_2008-01-13.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Kevin%20Garnett%202008-01-13.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Anthony Davis": {
      "title": "Anthony%20Davis%20pre-game%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Anthony_Davis_pre-game_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Anthony%20Davis%20pre-game%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Alonzo Mourning": {
      "title": "Alonzo%20Mourning.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Alonzo_Mourning.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Alonzo%20Mourning.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Spartacus": {
      "title": "%CE%A3%CF%80%CE%AC%CF%81%CF%84%CE%B1%CE%BA%CE%BF%CF%82%20Spartacus%2CEspartaco%20marble%20statue%20in%20Louvre%20%22%CE%9C%CE%B1%CE%B9%CE%B4%CE%BF%CE%B9%20clan%20-Meadow%22%20slave%20macedon-greek.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/%CE%A3%CF%80%CE%AC%CF%81%CF%84%CE%B1%CE%BA%CE%BF%CF%82_Spartacus%2CEspartaco_marble_statue_in_Louvre_%22%CE%9C%CE%B1%CE%B9%CE%B4%CE%BF%CE%B9_clan_-Meadow%22_slave_macedon-greek.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/%CE%A3%CF%80%CE%AC%CF%81%CF%84%CE%B1%CE%BA%CE%BF%CF%82%20Spartacus%2CEspartaco%20marble%20statue%20in%20Louvre%20%22%CE%9C%CE%B1%CE%B9%CE%B4%CE%BF%CE%B9%20clan%20-Meadow%22%20slave%20macedon-greek.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "William Wallace": {
      "title": "William%20Wallace.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/William_Wallace.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/William%20Wallace.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Leonidas": {
      "title": "KKK%206093.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/KKK_6093.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/KKK%206093.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Attila the Hun": {
      "title": "Atilla%20the%20Hun%20%28calypsonian%29%20ca.%201938-1940.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Atilla_the_Hun_(calypsonian)_ca._1938-1940.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Atilla%20the%20Hun%20%28calypsonian%29%20ca.%201938-1940.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Vlad the Impaler": {
      "title": "Vlad%20%C5%A2epe%C5%9F%2C%20the%20Impaler%2C%20Prince%20of%20Wallachia%20%281456-1462%29%20%28died%201477%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Vlad_%C5%A2epe%C5%9F%2C_the_Impaler%2C_Prince_of_Wallachia_(1456-1462)_(died_1477).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Vlad%20%C5%A2epe%C5%9F%2C%20the%20Impaler%2C%20Prince%20of%20Wallachia%20%281456-1462%29%20%28died%201477%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Achilles": {
      "title": "Achilles%20by%20Lycomedes%20Louvre%20Ma2120.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Achilles_by_Lycomedes_Louvre_Ma2120.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Achilles%20by%20Lycomedes%20Louvre%20Ma2120.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Miyamoto Musashi": {
      "title": "Ch%C5%8Dj%C5%ABr%C5%8D%20Kawarasaki%20in%20Miyamoto%20Musashi%2C%201944.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C5%8Dj%C5%ABr%C5%8D_Kawarasaki_in_Miyamoto_Musashi%2C_1944.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ch%C5%8Dj%C5%ABr%C5%8D%20Kawarasaki%20in%20Miyamoto%20Musashi%2C%201944.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "John Cena": {
      "title": "John%20Cena%20by%20Gage%20Skidmore.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Cena_by_Gage_Skidmore.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/John%20Cena%20by%20Gage%20Skidmore.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Zdeno Chara": {
      "title": "Zdeno%20Chara%20-%20Boston%20Bruins%202012.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Zdeno_Chara_-_Boston_Bruins_2012.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Zdeno%20Chara%20-%20Boston%20Bruins%202012.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Rob Gronkowski": {
      "title": "190326-D-SW162-1977%20%2846564316465%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/190326-D-SW162-1977_(46564316465).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/190326-D-SW162-1977%20%2846564316465%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Rocky Marciano": {
      "title": "Rocky%20Marciano%20by%20Stanley%20Weston.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rocky_Marciano_by_Stanley_Weston.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Rocky%20Marciano%20by%20Stanley%20Weston.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Larry Csonka": {
      "title": "Larry%20Csonka%201972.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Larry_Csonka_1972.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Larry%20Csonka%201972.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mike Alstott": {
      "title": "Mike%20Alstott%20ESPNWeekend2010-082.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mike_Alstott_ESPNWeekend2010-082.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Mike%20Alstott%20ESPNWeekend2010-082.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jerome Bettis": {
      "title": "Jerome%20Bettis%20at%20Health%20event%2C%20May%202005%2C%20cropped.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jerome_Bettis_at_Health_event%2C_May_2005%2C_cropped.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jerome%20Bettis%20at%20Health%20event%2C%20May%202005%2C%20cropped.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Anderson Silva": {
      "title": "Anderson%20Silva.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Anderson_Silva.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Anderson%20Silva.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Butterbean": {
      "title": "Eric%20Esch%202006.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Eric_Esch_2006.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Eric%20Esch%202006.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Chuck Bednarik": {
      "title": "ChuckBednarik1952Bowman.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/ChuckBednarik1952Bowman.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/ChuckBednarik1952Bowman.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Evander Holyfield": {
      "title": "Evander%20Holyfield%20LA%202011.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Evander_Holyfield_LA_2011.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Evander%20Holyfield%20LA%202011.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "David Robinson": {
      "title": "David%20Robinson%20%28Team%20USA%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/David_Robinson_(Team_USA).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/David%20Robinson%20%28Team%20USA%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dikembe Mutombo": {
      "title": "Dikembe%20Mutombo%20at%20the%20Aspire4Sport%20Congress%20in%20Doha.%20crop.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dikembe_Mutombo_at_the_Aspire4Sport_Congress_in_Doha._crop.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dikembe%20Mutombo%20at%20the%20Aspire4Sport%20Congress%20in%20Doha.%20crop.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Moses Malone": {
      "title": "Moses%20Malone%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Moses_Malone_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Moses%20Malone%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dwayne \"The Rock\" Johnson": {
      "title": "Dwayne%20Johnson-1809%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dwayne_Johnson-1809_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dwayne%20Johnson-1809%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Batista": {
      "title": "Batista%20in%20March%202019.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Batista_in_March_2019.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Batista%20in%20March%202019.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Randy Savage": {
      "title": "Randy%20Savage%201988.jpeg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Randy_Savage_1988.jpeg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Randy%20Savage%201988.jpeg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Randy Orton": {
      "title": "Randy%20Orton%20RR24%20%28cropped%202%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Randy_Orton_RR24_(cropped_2).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Randy%20Orton%20RR24%20%28cropped%202%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Triple H": {
      "title": "Triple%20H%20November%202017.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Triple_H_November_2017.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Triple%20H%20November%202017.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Roman Reigns": {
      "title": "Roman%20Reigns%20RR25%20%281%29%20%28headshot%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Roman_Reigns_RR25_(1)_(headshot).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Roman%20Reigns%20RR25%20%281%29%20%28headshot%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Goldberg": {
      "title": "Zlvrch.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Zlvrch.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Zlvrch.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "CM Punk": {
      "title": "CM%20Punk%20at%20San%20Diego%20Comic%20Con%202026.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/CM_Punk_at_San_Diego_Comic_Con_2026.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/CM%20Punk%20at%20San%20Diego%20Comic%20Con%202026.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kane": {
      "title": "Glenn%20Jacobs%20%282023%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Glenn_Jacobs_(2023).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Glenn%20Jacobs%20%282023%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Big Show": {
      "title": "Titi%20M%C3%BCller%2C%20Bianca%20Andrade%20and%20Vivian%20Amorim%20during%20%22A%20Elimina%C3%A7%C3%A3o%22%20on%20February%2027%2C%202020%2009.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Titi_M%C3%BCller%2C_Bianca_Andrade_and_Vivian_Amorim_during_%22A_Elimina%C3%A7%C3%A3o%22_on_February_27%2C_2020_09.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Titi%20M%C3%BCller%2C%20Bianca%20Andrade%20and%20Vivian%20Amorim%20during%20%22A%20Elimina%C3%A7%C3%A3o%22%20on%20February%2027%2C%202020%2009.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mark Henry": {
      "title": "WHCmarkHenry.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/WHCmarkHenry.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/WHCmarkHenry.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ronda Rousey": {
      "title": "Rousey%20HOF%202018%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rousey_HOF_2018_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Rousey%20HOF%202018%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Amanda Nunes": {
      "title": "Ceremonial%20weigh%20ins%20-%20Amanda%20Nunes%20vs%20Julianna%20Pe%C3%B1a%20UFC%20269%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ceremonial_weigh_ins_-_Amanda_Nunes_vs_Julianna_Pe%C3%B1a_UFC_269_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ceremonial%20weigh%20ins%20-%20Amanda%20Nunes%20vs%20Julianna%20Pe%C3%B1a%20UFC%20269%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jon Jones": {
      "title": "Jon%20Jones%20being%20interviewed.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jon_Jones_being_interviewed.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jon%20Jones%20being%20interviewed.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Chuck Liddell": {
      "title": "Chuck%20Liddell%20in%20Santa%20Monica-California%202005%20photo%20by%20Ithaka%20Darin%20Pappas.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Chuck_Liddell_in_Santa_Monica-California_2005_photo_by_Ithaka_Darin_Pappas.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Chuck%20Liddell%20in%20Santa%20Monica-California%202005%20photo%20by%20Ithaka%20Darin%20Pappas.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Randy Couture": {
      "title": "Randy%20Couture%20by%20Gage%20Skidmore.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Randy_Couture_by_Gage_Skidmore.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Randy%20Couture%20by%20Gage%20Skidmore.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Fedor Emelianenko": {
      "title": "Fedor%20Emelianenko%202006.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Fedor_Emelianenko_2006.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Fedor%20Emelianenko%202006.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Daniel Cormier": {
      "title": "Daniel%20Cormier%20taking%20a%20picture%20with%20a%20fan..jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Daniel_Cormier_taking_a_picture_with_a_fan..jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Daniel%20Cormier%20taking%20a%20picture%20with%20a%20fan..jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Tyson Fury": {
      "title": "Tyson%20Fury%20at%20Place%20Bell%2C%20Laval%20Quebec%2C%20Canada%20-%20Dec%2016%202017%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Tyson_Fury_at_Place_Bell%2C_Laval_Quebec%2C_Canada_-_Dec_16_2017_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Tyson%20Fury%20at%20Place%20Bell%2C%20Laval%20Quebec%2C%20Canada%20-%20Dec%2016%202017%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Deontay Wilder": {
      "title": "Deontay%20Wilder%202018%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Deontay_Wilder_2018_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Deontay%20Wilder%202018%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Lennox Lewis": {
      "title": "Lenox%20Lewis%202010%20cropped.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Lenox_Lewis_2010_cropped.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Lenox%20Lewis%202010%20cropped.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Joe Frazier": {
      "title": "Joe%20Frazier%20color%20portrait.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Joe_Frazier_color_portrait.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Joe%20Frazier%20color%20portrait.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Sonny Liston": {
      "title": "Sonny%20Liston%201962%20Portrait.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sonny_Liston_1962_Portrait.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Sonny%20Liston%201962%20Portrait.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jack Dempsey": {
      "title": "Jack%20Dempsey%203.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jack_Dempsey_3.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jack%20Dempsey%203.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Georges St-Pierre": {
      "title": "Georges%20St-Pierre%20crop.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Georges_St-Pierre_crop.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Georges%20St-Pierre%20crop.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Khabib Nurmagomedov": {
      "title": "Khabib%20nurmagomedov.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Khabib_nurmagomedov.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Khabib%20nurmagomedov.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ndamukong Suh": {
      "title": "Ndamukong%20Suh%20Dolphins.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ndamukong_Suh_Dolphins.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ndamukong%20Suh%20Dolphins.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Trent Williams": {
      "title": "Trent%20williams%202014.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Trent_williams_2014.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Trent%20williams%202014.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jonathan Ogden": {
      "title": "Jonathan%20Ogden.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jonathan_Ogden.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jonathan%20Ogden.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "\"Mean\" Joe Greene": {
      "title": "Mean%20Joe%20Greene%201975.JPG",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Mean_Joe_Greene_1975.JPG?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Mean%20Joe%20Greene%201975.JPG",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Alan Page": {
      "title": "AlanPage.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/AlanPage.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/AlanPage.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Lou Ferrigno": {
      "title": "Lou%20Ferrigno%20during%20Ribbon%20Cutting%20at%20Galaxy%20Con%20Richmond%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Lou_Ferrigno_during_Ribbon_Cutting_at_Galaxy_Con_Richmond_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Lou%20Ferrigno%20during%20Ribbon%20Cutting%20at%20Galaxy%20Con%20Richmond%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Brian Shaw": {
      "title": "Brian%20Shaw.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Brian_Shaw.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Brian%20Shaw.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Eddie Hall": {
      "title": "Eddie%20Hall.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Eddie_Hall.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Eddie%20Hall.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Leonardo da Vinci": {
      "title": "Francesco%20Melzi%20-%20Portrait%20of%20Leonardo.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Francesco_Melzi_-_Portrait_of_Leonardo.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Francesco%20Melzi%20-%20Portrait%20of%20Leonardo.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Michelangelo": {
      "title": "Michelangelo%20Daniele%20da%20Volterra%20%28dettaglio%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Michelangelo_Daniele_da_Volterra_(dettaglio).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Michelangelo%20Daniele%20da%20Volterra%20%28dettaglio%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Vincent van Gogh": {
      "title": "Self-portrait%20-%20Vincent%20van%20Gogh.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Self-portrait_-_Vincent_van_Gogh.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Self-portrait%20-%20Vincent%20van%20Gogh.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Pablo Picasso": {
      "title": "Modigliani%2C%20Picasso%20and%20Andr%C3%A9%20Salmon.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Modigliani%2C_Picasso_and_Andr%C3%A9_Salmon.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Modigliani%2C%20Picasso%20and%20Andr%C3%A9%20Salmon.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Claude Monet": {
      "title": "Claude%20Monet%201899%20Nadar%20crop.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Claude_Monet_1899_Nadar_crop.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Claude%20Monet%201899%20Nadar%20crop.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Rembrandt": {
      "title": "Panoramarijtuig%20SBB%20Utrecht.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Panoramarijtuig_SBB_Utrecht.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Panoramarijtuig%20SBB%20Utrecht.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Andy Warhol": {
      "title": "Andy%20Warhol%20at%20the%20Jewish%20Museum%20%28by%20Bernard%20Gotfryd%29%20%E2%80%93%20LOC.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Andy_Warhol_at_the_Jewish_Museum_(by_Bernard_Gotfryd)_%E2%80%93_LOC.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Andy%20Warhol%20at%20the%20Jewish%20Museum%20%28by%20Bernard%20Gotfryd%29%20%E2%80%93%20LOC.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Salvador Dali": {
      "title": "Salvador%20Dal%C3%AD%201939.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Salvador_Dal%C3%AD_1939.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Salvador%20Dal%C3%AD%201939.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Frida Kahlo": {
      "title": "Frida%20Kahlo%2C%20by%20Guillermo%20Kahlo%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Frida_Kahlo%2C_by_Guillermo_Kahlo_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Frida%20Kahlo%2C%20by%20Guillermo%20Kahlo%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Banksy": {
      "title": "Banksy%20signature-removebg-preview.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Banksy_signature-removebg-preview.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Banksy%20signature-removebg-preview.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Georgia O'Keeffe": {
      "title": "Georgia%20O%27Keeffe%20MET%20DP236330.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Georgia_O'Keeffe_MET_DP236330.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Georgia%20O%27Keeffe%20MET%20DP236330.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Francisco Goya": {
      "title": "Vicente%20L%C3%B3pez%20Porta%C3%B1a%20-%20el%20pintor%20Francisco%20de%20Goya.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Vicente_L%C3%B3pez_Porta%C3%B1a_-_el_pintor_Francisco_de_Goya.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Vicente%20L%C3%B3pez%20Porta%C3%B1a%20-%20el%20pintor%20Francisco%20de%20Goya.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jean-Michel Basquiat": {
      "title": "Basquiat.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Basquiat.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Basquiat.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Yayoi Kusama": {
      "title": "Yayoi%20Kusama%20in%202005.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Yayoi_Kusama_in_2005.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Yayoi%20Kusama%20in%202005.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jackson Pollock": {
      "title": "Jackson%20Pollock%20by%20Hans%20Namuth.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jackson_Pollock_by_Hans_Namuth.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jackson%20Pollock%20by%20Hans%20Namuth.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Hokusai": {
      "title": "Crater%20Hokusai%2C%20Mercury%2C%20MESSENGER.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Crater_Hokusai%2C_Mercury%2C_MESSENGER.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Crater%20Hokusai%2C%20Mercury%2C%20MESSENGER.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Raphael": {
      "title": "Raffaello%20Sanzio.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Raffaello_Sanzio.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Raffaello%20Sanzio.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Johannes Vermeer": {
      "title": "Cropped%20version%20of%20Jan%20Vermeer%20van%20Delft%20002.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Cropped_version_of_Jan_Vermeer_van_Delft_002.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Cropped%20version%20of%20Jan%20Vermeer%20van%20Delft%20002.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Caravaggio": {
      "title": "Bild-Ottavio%20Leoni%2C%20Caravaggio.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bild-Ottavio_Leoni%2C_Caravaggio.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bild-Ottavio%20Leoni%2C%20Caravaggio.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Henri Matisse": {
      "title": "Portrait%20of%20Henri%20Matisse%201933%20May%2020.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_of_Henri_Matisse_1933_May_20.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Portrait%20of%20Henri%20Matisse%201933%20May%2020.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Edvard Munch": {
      "title": "Edvard%20Munch%201933-2.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Edvard_Munch_1933-2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Edvard%20Munch%201933-2.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Gustav Klimt": {
      "title": "Klimt.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Klimt.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Klimt.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Sandro Botticelli": {
      "title": "Sandro%20Botticelli%20Self-portrait%20ca%201475.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Sandro_Botticelli_Self-portrait_ca_1475.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Sandro%20Botticelli%20Self-portrait%20ca%201475.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Edgar Degas": {
      "title": "Edgar%20Degas%20self%20portrait%201855FXD.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Edgar_Degas_self_portrait_1855FXD.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Edgar%20Degas%20self%20portrait%201855FXD.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Pierre-Auguste Renoir": {
      "title": "Pierre%20Auguste%20Renoir%2C%20uncropped%20image.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Pierre_Auguste_Renoir%2C_uncropped_image.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Pierre%20Auguste%20Renoir%2C%20uncropped%20image.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Paul Cezanne": {
      "title": "Paul-Cezanne.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Paul-Cezanne.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Paul-Cezanne.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Auguste Rodin": {
      "title": "Auguste%20Rodin%20fotografato%20da%20Nadar%20nel%201891.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Auguste_Rodin_fotografato_da_Nadar_nel_1891.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Auguste%20Rodin%20fotografato%20da%20Nadar%20nel%201891.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "M. C. Escher": {
      "title": "Maurits%20Cornelis%20Escher.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Maurits_Cornelis_Escher.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Maurits%20Cornelis%20Escher.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Rene Magritte": {
      "title": "Ren%C3%A9%20Magritte%20in%201961.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ren%C3%A9_Magritte_in_1961.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ren%C3%A9%20Magritte%20in%201961.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Keith Haring": {
      "title": "Keith%20Haring%20%281986%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Keith_Haring_(1986).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Keith%20Haring%20%281986%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Roy Lichtenstein": {
      "title": "Roy%20Lichtenstein%2C%20painter%201969%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Roy_Lichtenstein%2C_painter_1969_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Roy%20Lichtenstein%2C%20painter%201969%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Diego Rivera": {
      "title": "Diego%20Rivera%20-%20Google%20Art%20Project%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Diego_Rivera_-_Google_Art_Project_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Diego%20Rivera%20-%20Google%20Art%20Project%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Artemisia Gentileschi": {
      "title": "Artemisia%20Gentileschi%20Selfportrait%20Martyr.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Artemisia_Gentileschi_Selfportrait_Martyr.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Artemisia%20Gentileschi%20Selfportrait%20Martyr.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ai Weiwei": {
      "title": "Aj%20Wej-wej%20I%20%282017%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Aj_Wej-wej_I_(2017).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Aj%20Wej-wej%20I%20%282017%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ansel Adams": {
      "title": "Ansel%20Adams%20and%20camera.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ansel_Adams_and_camera.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ansel%20Adams%20and%20camera.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Dorothea Lange": {
      "title": "Dorothea%20Lange%201936%20portrait.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Dorothea_Lange_1936_portrait.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Dorothea%20Lange%201936%20portrait.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bob Ross": {
      "title": "Bob%20Ross%20publicity%20photo%20%28c.%201982%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bob_Ross_publicity_photo_(c._1982)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bob%20Ross%20publicity%20photo%20%28c.%201982%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Norman Rockwell": {
      "title": "Rockwell-Norman-LOC.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Rockwell-Norman-LOC.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Rockwell-Norman-LOC.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Takashi Murakami": {
      "title": "Takashi%20Murakami%20at%20Versailles%20Sept.%202010%20%281%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Takashi_Murakami_at_Versailles_Sept._2010_(1).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Takashi%20Murakami%20at%20Versailles%20Sept.%202010%20%281%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Edward Hopper": {
      "title": "Edward%20Hopper%2C%20New%20York%20artist%20LCCN2016871478%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Edward_Hopper%2C_New_York_artist_LCCN2016871478_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Edward%20Hopper%2C%20New%20York%20artist%20LCCN2016871478%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Ludwig van Beethoven": {
      "title": "Beethoven.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Beethoven.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Beethoven.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "John Lennon": {
      "title": "John%20Lennon%2C%201974%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/John_Lennon%2C_1974_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/John%20Lennon%2C%201974%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Johann Sebastian Bach": {
      "title": "Johann%20Sebastian%20Bach.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Johann_Sebastian_Bach.png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Johann%20Sebastian%20Bach.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bob Dylan": {
      "title": "DylanYoungKilkenny140719v2%20%2850%20of%2052%29%20%2852246124397%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/DylanYoungKilkenny140719v2_(50_of_52)_(52246124397)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/DylanYoungKilkenny140719v2%20%2850%20of%2052%29%20%2852246124397%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Miles Davis": {
      "title": "Miles%20Davis%20%28Three%20Deuces%2C%20New%20York%2C%20N.Y.%201947%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Miles_Davis_(Three_Deuces%2C_New_York%2C_N.Y._1947).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Miles%20Davis%20%28Three%20Deuces%2C%20New%20York%2C%20N.Y.%201947%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Aretha Franklin": {
      "title": "Aretha%20Franklin%201968.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Aretha_Franklin_1968.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Aretha%20Franklin%201968.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Wolfgang Amadeus Mozart": {
      "title": "Wolfgang-amadeus-mozart%201.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Wolfgang-amadeus-mozart_1.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Wolfgang-amadeus-mozart%201.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Jimi Hendrix": {
      "title": "Jimi%20Hendrix%20%281967%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Jimi_Hendrix_(1967)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Jimi%20Hendrix%20%281967%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Nina Simone": {
      "title": "Nina%20Simone%201965%20-%20restoration1.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Nina_Simone_1965_-_restoration1.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Nina%20Simone%201965%20-%20restoration1.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Stevie Wonder": {
      "title": "Stevie%20Wonder%201994.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Stevie_Wonder_1994.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Stevie%20Wonder%201994.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Paul McCartney": {
      "title": "Paul%20McCartney%20in%20October%202018.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Paul_McCartney_in_October_2018.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Paul%20McCartney%20in%20October%202018.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kanye West": {
      "title": "Kanye West",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Kanye_West_at_the_2009_Tribeca_Film_Festival_%28crop_2%29.jpg/330px-Kanye_West_at_the_2009_Tribeca_Film_Festival_%28crop_2%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Kanye_West",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Beyonce": {
      "title": "LucianoEstevan2.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/LucianoEstevan2.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/LucianoEstevan2.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Morrissey": {
      "title": "Morrissey%20crop%20tie.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Morrissey_crop_tie.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Morrissey%20crop%20tie.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "David Bowie": {
      "title": "David-Bowie%20Chicago%202002-08-08%20photoby%20Adam-Bielawski-cropped.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/David-Bowie%20Chicago%202002-08-08%20photoby%20Adam-Bielawski-cropped.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Kendrick Lamar": {
      "title": "Kendrick Lamar",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg/330px-KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Kendrick_Lamar",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Thom Yorke": {
      "title": "AllPointsEastAug2022%20%28327%20of%20385%29%20%2852327062411%29%20%28cropped%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/AllPointsEastAug2022_(327_of_385)_(52327062411)_(cropped)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/AllPointsEastAug2022%20%28327%20of%20385%29%20%2852327062411%29%20%28cropped%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Madlib": {
      "title": "Madlib",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/4C1A9262-2_%28cropped%29.jpg/330px-4C1A9262-2_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Madlib",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "David Byrne": {
      "title": "David Byrne",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/David_Byrne_San_Diego.jpg/330px-David_Byrne_San_Diego.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/David_Byrne",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Ozzy Osbourne": {
      "title": "Ozzy Osbourne",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Ozzy_Osbourne_in_1970_%28medium-sized_crop%29.jpg/330px-Ozzy_Osbourne_in_1970_%28medium-sized_crop%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Ozzy_Osbourne",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Alanis Morissette": {
      "title": "Alanis Morissette",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Glasto_2025_%2846%29_-_Alanis_Morissette_%28cropped%29.jpg/330px-Glasto_2025_%2846%29_-_Alanis_Morissette_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Alanis_Morissette",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Brian Wilson": {
      "title": "Brian Wilson",
      "url": "https://upload.wikimedia.org/wikipedia/commons/d/db/Brian_Wilson_1964.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
      "pageUrl": "https://en.wikipedia.org/wiki/Brian_Wilson",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Tyler, The Creator": {
      "title": "Tyler, the Creator",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Tyler_The_Creator_Toronto_2025_%28cropped%29.jpg/330px-Tyler_The_Creator_Toronto_2025_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Tyler,_the_Creator",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "RZA": {
      "title": "RZA",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/RZA_speaking_at_the_2018_San_Diego_Comic_Con_International_%28cropped%29.jpg/330px-RZA_speaking_at_the_2018_San_Diego_Comic_Con_International_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/RZA",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Aphex Twin": {
      "title": "Aphex Twin",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Aphextwin1.jpg/330px-Aphextwin1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Aphex_Twin",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Kurt Cobain": {
      "title": "Kurt Cobain",
      "url": "https://upload.wikimedia.org/wikipedia/commons/3/37/Nirvana_around_1992_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled",
      "pageUrl": "https://en.wikipedia.org/wiki/Kurt_Cobain",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Kate Bush": {
      "title": "Kate Bush",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Kate_Bush_Hounds_of_Love_%281985_EMI_publicity_photo%29_02_%28cropped%29.jpg/330px-Kate_Bush_Hounds_of_Love_%281985_EMI_publicity_photo%29_02_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Kate_Bush",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Prince": {
      "title": "Prince%20promo%20picture%20%281988%3B%20cropped%20and%20retouched%29.png",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Prince_promo_picture_(1988%3B_cropped_and_retouched).png?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Prince%20promo%20picture%20%281988%3B%20cropped%20and%20retouched%29.png",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Mick Jagger": {
      "title": "RStonesHydePark030722%20%2849%20of%20125%29%20%2852193656268%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/RStonesHydePark030722_(49_of_125)_(52193656268)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/RStonesHydePark030722%20%2849%20of%20125%29%20%2852193656268%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Michael Jackson": {
      "title": "Michael%20Jackson%201983%20%283x4%20cropped%29%20%28contrast%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Jackson_1983_(3x4_cropped)_(contrast).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Jackson%201983%20%283x4%20cropped%29%20%28contrast%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Frank Zappa": {
      "title": "Zappa.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Zappa.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Zappa.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bjork": {
      "title": "Bj%C3%B6rk%20at%20Cannes.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Bj%C3%B6rk_at_Cannes.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Bj%C3%B6rk%20at%20Cannes.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "SZA": {
      "title": "KendrickSZASPurs230725-19%20-%2054683179509%20%28cropped%29%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/KendrickSZASPurs230725-19_-_54683179509_(cropped)_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/KendrickSZASPurs230725-19%20-%2054683179509%20%28cropped%29%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Nobuo Uematsu": {
      "title": "Nobuo%20Uematsu.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Nobuo_Uematsu.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Nobuo%20Uematsu.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Joni Mitchell": {
      "title": "Joni%20Mitchell%202021%20Kennedy%20Center%20Honors%20%28cropped%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Joni_Mitchell_2021_Kennedy_Center_Honors_(cropped).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Joni%20Mitchell%202021%20Kennedy%20Center%20Honors%20%28cropped%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Madonna": {
      "title": "Samuel%20Arlent-Edwards%20-%20Madonna%20-%201923.372%20-%20Cleveland%20Museum%20of%20Art.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Samuel_Arlent-Edwards_-_Madonna_-_1923.372_-_Cleveland_Museum_of_Art.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Samuel%20Arlent-Edwards%20-%20Madonna%20-%201923.372%20-%20Cleveland%20Museum%20of%20Art.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Lauryn Hill": {
      "title": "Ms.%20Lauryn%20Hill%2008.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Ms._Lauryn_Hill_08.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Ms.%20Lauryn%20Hill%2008.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Neil Young": {
      "title": "Neil%20Young%20Stavernfestivalen%202016%20%28220929%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Neil_Young_Stavernfestivalen_2016_(220929).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Neil%20Young%20Stavernfestivalen%202016%20%28220929%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "JPEGMAFIA": {
      "title": "JPEGMafia%20202I%20%28cropped%3B%20portrait%29.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/JPEGMafia_202I_(cropped%3B_portrait).jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/JPEGMafia%20202I%20%28cropped%3B%20portrait%29.jpg",
      "source": "Wikidata / Wikimedia Commons"
    },
    "Bad Bunny": {
      "title": "Bad Bunny",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg/330px-Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Bad_Bunny",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Eminem": {
      "title": "Eminem",
      "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Eminem_2021_Color_Corrected.jpg/330px-Eminem_2021_Color_Corrected.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
      "pageUrl": "https://en.wikipedia.org/wiki/Eminem",
      "source": "Wikipedia / Wikimedia Commons"
    },
    "Dolly Parton": {
      "title": "Young-Dolly-Parton.jpg",
      "url": "https://commons.wikimedia.org/wiki/Special:FilePath/Young-Dolly-Parton.jpg?width=320",
      "pageUrl": "http://commons.wikimedia.org/wiki/Special:FilePath/Young-Dolly-Parton.jpg",
      "source": "Wikidata / Wikimedia Commons"
    }
  };
  const slugify = (name) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const roleRating = (attributes, role) => Math.round(Object.entries(ROLE_WEIGHTS[role]).reduce((sum, [name, weight]) => sum + (attributes[name] || 0) * weight, 0));
  const rows = TABLE.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
  const header = rows.shift().split("|").map((cell) => cell.trim());
  const flexIndex = header.indexOf("FLEX");
  return rows.map((line) => {
    const cells = line.split("|").map((cell) => cell.trim());
    const [name, primaryRole] = cells;
    if (!ROLE_WEIGHTS[primaryRole]) console.warn(`player-ratings.js: unknown role "${primaryRole}" for ${name}`);
    const flexRoles = flexIndex >= 0 ? cells[flexIndex].split("/").map((role) => role.trim()).filter((role) => ROLE_WEIGHTS[role]) : [];
    const attributes = {};
    header.forEach((code, index) => { if (COLUMNS[code]) attributes[COLUMNS[code]] = Number(cells[index]) || 0; });
    const roleRatings = Object.fromEntries(Object.keys(ROLE_WEIGHTS).map((role) => {
      const natural = role === primaryRole || flexRoles.includes(role);
      return [role, Math.max(1, roleRating(attributes, role) - (natural ? 0 : OUT_OF_POSITION_PENALTY))];
    }));
    return { id: slugify(name), name, primaryRole, flexRoles, attributes, roleRatings, overall: roleRatings[primaryRole], image: PLAYER_IMAGES[name] || null, form: 0, traits: [] };
  });
});
