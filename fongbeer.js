$('#formFile').change(function() {
  readImgUrlAndPreview(this);

  function readImgUrlAndPreview(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $('#imagePreview').removeClass('hide').attr('src', e.target.result);
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
});



let userid = ""

window.onload = function(e) {
  /** activityliff */
  liff.init({ liffId: "1655967050-nabVl55J" }, function() {
    liff.ready.then(() => {
      if (liff.isLoggedIn()) {
        liff.getProfile().then(profile => {
          var name = profile.displayName
          userid = profile.userId
          var picurl = profile.pictureUrl
          var stat = profile.statusMessage
          console.log(userid)
        })

      } else {
        liff.login();
      }
    })
      .catch((err) => {
        console.error(err.message);
      });
  });
}

const formRegis = document.querySelector("form")
const xxd = document.getElementById('xxd')
const name = document.getElementById('name')
const tel2 = document.getElementById('tel2')
const line_id = document.getElementById('line_id')
const email = document.getElementById('email')
const inputformFile = document.getElementById('formFile')
// const inputformFileA = document.getElementById('formFile1')

formRegis.addEventListener('submit', (e) => {
  e.preventDefault()
  const chk = checkValidity()
})


const checkValidity = (() => {
  loadingStart()
  let obj = {};
  obj.uid = userid
  for (var i = 0; i < formRegis.elements.length; i++) {
    var item = formRegis.elements.item(i);

    obj[item.name] = item.value;
  }
  var idbarcode = userid.slice(0, 8)
  const radioval = $('input[name="radiostacked"]:checked').val();
  obj.radiostacked = radioval

  var canvas = document.createElement("canvas");
  JsBarcode(canvas, "" + idbarcode, { format: "CODE39", text: "Scan For ID" });
  let barcode = canvas.toDataURL("image/png");
  console.log(barcode)
  obj.barcode = barcode.split(',')[1];


  console.log(obj)
  var file = inputformFile.files[0];
  var reader = new FileReader(); //อ่านไฟล์เพื่อเตรียมแปลงข้อมูล
  reader.readAsDataURL(file) //แปลงไฟล์เป็นแบบ Base64
  reader.onload = function() {
    obj.img = reader.result.split(',')[1];  //ดึงข้อมูลไฟล์เฉพาะส่วนที่เป็น Base64
    console.log(obj.img)
    obj.filename = file.name
    obj.filetype = file.type

    const resfetch = fetchData(obj)
    console.log("dddd", resfetch)
    // เปิดส่วนนี้ ถ้าจะอัพสองไฟล์    
    // }
    // var fileA = inputformFileA.files[0];
    // var readerA = new FileReader(); //อ่านไฟล์เพื่อเตรียมแปลงข้อมูล
    // readerA.readAsDataURL(fileA) //แปลงไฟล์เป็นแบบ Base64
    // readerA.onload = function() {
    //   obj.imgA = readerA.result.split(',')[1];  //ดึงข้อมูลไฟล์เฉพาะส่วนที่เป็น Base64
    //   obj.filenameA = fileA.name
    //   obj.filetypeA = fileA.type
    // const resfetch = fetchData(obj)
    // console.log("dddd", resfetch)
    //ถึงตรงนี้นะครับเก๋




  }
})


/** ฟังก์ชั่น fetchData ไป Google Sheets */
const fetchData = (async (obj) => {
  console.log(obj)
  let unamel = name.value
  const url = "https://script.google.com/macros/s/AKfycbxEw5ZwLIKB9Q_4oGqVoNlaR8g8d9qldz95V6wwcVQVkSUL3ZfSf24hkE4SlR3_j88mng/exec"


  const formData = new FormData();

  formData.append('ids', '0811111130');
  formData.append('objs', JSON.stringify(obj))

  const response = await fetch(url + "?type=3", {
    method: 'POST',
    body: formData
  })
  const json = await response.json()
  const result = JSON.stringify(json)
  let ul = json.urlbarcode
  let seatNo = json.seat
  // let sig = json.urlsig

  console.log(json)
  var ida = userid.slice(0, 8)
  var idb = userid.slice(7, 19)
  var idc = userid.slice(16, 24)

  console.log(seatNo)
  // console.log(idb)
  // console.log(idc)


  var cousename = xxd.value
  // var newxx = engname.value
  var row = seatNo
  if (
    liff.getContext().type !== 'none' &&
    liff.getContext().type !== 'external'
  ) {
    // Create flex message
    // const row = e.row
    let message = createFlexMessage(row, ul, cousename, ida, unamel,seatNo);

    // Send messages
    liff
      .sendMessages(message)
      .then(() => {
        setTimeout(function() {
          loadingEnd();
          alert('บันทึกข้อมูลเรียบร้อย');
          liff.closeWindow();
        }, 600);
      })
      .catch((err) => {
        console.error(err.code, error.message);
      });
  } else {
    console.log("show pc")
    loadingEnd();
    formRegis.reset()
    alert('บันทึกข้อมูลเรียบร้อย');

  }

})


// Creat flex message
function createFlexMessage(row, ul, cousename, ida, unamel,seatNo) {
  // Using flex message simulator for json
  const DATE = new Date();
  const textDate = new Intl.DateTimeFormat('th-TH', { dateStyle: 'short', timezone: "asia/bangkok" }).format(DATE)
  const textTime = new Intl.DateTimeFormat('th-TH', { timeStyle: 'short', timezone: "asia/bangkok" }).format(DATE)

  let flexJson = {
    "type": "flex",
    "altText": "Flex Message",
    "contents": {
  "type": "bubble",
  "size": "giga",
  "header": {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": "https://res.cloudinary.com/gukkghu/image/upload/v1681107747/Kids_Bible_Study_nn4iay.png",
            "size": "full",
            "align": "center"
          }
        ],
        "cornerRadius": "200px"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Success",
            "align": "center",
            "size": "3xl",
            "color": "#FFFFFF",
            "weight": "bold",
            "wrap": true
          }
        ],
        "paddingTop": "40px"
      }
    ],
    "spacing": "md",
    "background": {
      "type": "linearGradient",
      "angle": "0deg",
      "startColor": "#caefd7",
      "endColor": "#abc9e9",
      "centerColor": "#f5bfd7"
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": ""+unamel,
                    "size": "xxl",
                    "align": "start",
                    "weight": "bold",
                    "color": "#32c4c0"
                  },
                  {
                    "type": "text",
                    "text": "course : "+cousename,
                    "align": "start",
                    "size": "lg",
                    "weight": "regular"
                  }
                ],
                "offsetTop": "5px"
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Date : "+textDate+" | "+textTime  ,
                        "wrap": true,
                        "align": "start"
                      },
                      {
                        "type": "text",
                        "text": "SEAT : "+row,
                        "color": "#32c4c0"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "separator"
              }
            ],
            "spacing": "md",
            "borderColor": "#ffffff",
            "paddingAll": "10px"
          },
          {
            "type": "text",
            "text": "กรุณารอรับ  Link เข้า Zoom ทาง Email",
            "wrap": true,
            "align": "center",
            "color": "#8364e8",
            "size": "lg"
          }
        ],
        "paddingAll": "10px"
      },
      {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "image",
            "url": ""+ul,
            "size": "xxl"
          }
        ]
      }
    ],
    "paddingAll": "5px",
    "spacing": "md"
  },
  "styles": {
    "header": {
      "backgroundColor": "#29914f"
    },
    "body": {
      "backgroundColor": "#caefd7"
    },
    "footer": {
      "separator": true
    }
  }
}

  };
  return [flexJson];
}



function loadingStart() {
  document.getElementById('loading').classList.remove('d-none');
}

function loadingEnd() {
  document.getElementById('loading').classList.add('d-none');
}




