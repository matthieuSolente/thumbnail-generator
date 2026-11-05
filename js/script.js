const MAX_WIDTH = 1360;

const DEFAULT_PLAY_SIZE_PERCENT = 20;
const MIN_PLAY_SIZE_PERCENT = 10;
const MAX_PLAY_SIZE_PERCENT = 40;
/*
==================================================
COLLER ICI TES BASE64
==================================================
*/


/*
==================================================
ELEMENTS
==================================================
*/

const imageInput = document.getElementById("imageInput");
const playColor =
    document.getElementById("playColor");

const playColorHex =
    document.getElementById("playColorHex");

const showCircle =
    document.getElementById("showCircle");

const playSize =
    document.getElementById("playSize");

const playSizeValue =
    document.getElementById("playSizeValue");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const downloadArea = document.getElementById("downloadArea");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let generated = false;
let outputFileName = "thumbnail-video.png";

/*
==================================================
LOAD IMAGE
==================================================
*/

function loadImage(src){

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.onload = () => resolve(img);

        img.onerror = (err) => {
            console.error(err);
            reject(err);
        };

        img.src = src;

    });

}

/*
==================================================
GENERATION
==================================================
*/
playColor.addEventListener(
    "input",
    () => {
        playColorHex.value =
            playColor.value.toUpperCase();
    }
);

playColorHex.addEventListener(
    "input",
    () => {

        const hex =
            playColorHex.value.trim();

        if(
            /^#([A-Fa-f0-9]{6})$/.test(hex)
        ){
            playColor.value = hex;
        }
    }
);

playSize.addEventListener(
    "input",
    () => {
        playSizeValue.textContent =
            playSize.value + "%";
    }
);
function drawPlayButton(
    ctx,
    width,
    height,
    color,
    sizePercent,
    circle
){

   const size =
    Math.min(width, height)
    * (sizePercent / 100);

    const centerX =
        width / 2;

    const centerY =
        height / 2;

    const triangleWidth =
        size;

    const triangleHeight =
        size * 1.15;

    if(circle){

        const radius =
            size * 0.85;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = color;

        ctx.lineWidth =
            Math.max(
                2,
                radius * 0.08
            );

        ctx.stroke();
    }

    ctx.beginPath();

    ctx.moveTo(
        centerX - triangleWidth * 0.35,
        centerY - triangleHeight / 2
    );

    ctx.lineTo(
        centerX - triangleWidth * 0.35,
        centerY + triangleHeight / 2
    );

    ctx.lineTo(
        centerX + triangleWidth * 0.55,
        centerY
    );

    ctx.closePath();

    ctx.fillStyle = color;

    ctx.fill();
}
generateBtn.addEventListener("click", async () => {

    const file = imageInput.files[0];

    if(!file){
        alert("Choisissez une image.");
        return;
    }

    generated = false;

    const reader = new FileReader();

    reader.onload = async function(event){

        try{

            const sourceImage =
                await loadImage(
                    event.target.result
                );

            let width = sourceImage.width;
            let height = sourceImage.height;

            if(width > MAX_WIDTH){

                const ratio =
                    MAX_WIDTH / width;

                width = MAX_WIDTH;
                height =
                    Math.round(
                        height * ratio
                    );
            }

            canvas.width = width;
            canvas.height = height;

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            ctx.drawImage(
                sourceImage,
                0,
                0,
                width,
                height
            );
            /*
========================
Overlay noir 30%
========================
*/

ctx.save();
ctx.globalCompositeOperation = "source-atop";
ctx.fillStyle = "rgba(0,0,0,0.3)";
ctx.fillRect(0,0,width,height);
ctx.restore();
            
            const hexColor =
    playColorHex.value.trim();

if(
    !/^#([A-Fa-f0-9]{6})$/.test(hexColor)
){
    alert(
        "Code HEX invalide."
    );
    return;
}

drawPlayButton(
    ctx,
    width,
    height,
    hexColor,
    Number(playSize.value),
    showCircle.checked
);

            const extPos =
                file.name.lastIndexOf(".");

    outputFileName =
    extPos > -1
        ? file.name.substring(0, extPos) + "-video.png"
        : "thumbnail-video.png";


            generated = true;

            downloadArea.style.display =
                "block";

        }
        catch(error){

            console.error(error);

            alert(
                "Erreur lors de la génération."
            );

        }

    };

    reader.readAsDataURL(file);

});

/*
==================================================
DOWNLOAD
==================================================
*/

downloadBtn.addEventListener("click", () => {

    if(!generated){
        return;
    }

    try{

        const link =
            document.createElement("a");

        link.download =
            outputFileName;

        link.href =
            canvas.toDataURL(
    "image/png"
);

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

    }
    catch(error){

        console.error(error);

        alert(
            "Erreur export image."
        );
    }

});
