import { Component } from "preact";
import style from "./style.css";
import { useControls } from "leva";
import domToImage from "dom-to-image";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };

    this.onImageChange = this.onImageChange.bind(this);
  }

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      let url = URL.createObjectURL(img);
      let imgObject = new Image();

      imgObject.onload = () => {
        this.setState({
          image: url,
          imageHeight: imgObject.height,
          imageWidth: imgObject.width,
        });
      };

      imgObject.src = url;
    }
  };

  downloadImage = () => {
    domToImage
      .toJpeg(document.getElementById("image"), { quality: 1 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "taisternatorfied.jpeg";
        link.href = dataUrl;
        link.click();
      });
  };

  render() {
    const { columns, rows, blur, cornerRadius, heightRatio, eraser } =
      useControls({
        columns: {
          value: 10,
          min: 4,
          max: 50,
          step: 0.1,
        },
        rows: {
          value: 50,
          min: 1,
          max: 100,
          step: 1,
        },
        blur: {
          value: 100,
          min: 1,
          max: 500,
          step: 1,
        },
        cornerRadius: {
          value: 6,
          min: 0,
          max: 100,
          step: 1,
        },
        heightRatio: {
          value: 3,
          min: 1,
          max: 10,
          step: 0.1,
        },

        eraser: true,
      });

    function changeVisibility(e) {
      if (eraser) {
        e.target.style.cursor = "not-allowed";
        /*let oldOpacity = e.target.style.opacity ? e.target.style.opacity : 1;
        e.target.style.opacity =
          e.target.style.opacity > 0 ? oldOpacity - 0.1 : oldOpacity;*/
      } else {
        e.target.style.cursor = "copy";
        /*let oldOpacity = e.target.style.opacity ? e.target.style.opacity : 1;
        e.target.style.opacity =
          e.target.style.opacity < 1 ? oldOpacity + 0.1 : oldOpacity;*/
      }
    }

    const blurryBlocks = [...Array(columns * rows)].map((e, i) => (
      <div
        class={style.blurryblock}
        key={i}
        onPointerOver={changeVisibility}
        style={{
          width: 100 / columns + "%",
          backdropFilter: "blur(" + blur + "px)",
          borderRadius: cornerRadius + "px",
          height: 100 / rows + "%",
        }}
      />
    ));

    return (
      <div class={style.container}>
        <div>
          {this.state.image ? (
            <div
              class={style.image}
              id="image"
              style={{
                backgroundImage: "url(" + this.state.image + ")",
                aspectRatio:
                  this.state.imageWidth + "/" + this.state.imageHeight,
              }}
            >
              {this.state.image ? blurryBlocks : ""}
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          <input type="file" name="myImage" onChange={this.onImageChange} />
          {/* Dom to image doesn't know how to render backdropFilter effects, fuck 
					{this.state.image ? (
            <button onClick={this.downloadImage}>Download JPG</button>
          ) : (
            ""
					)} */}
        </div>
      </div>
    );
  }
}

export default Editor;
