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
    const { blockWidth, blur, cornerRadius, heightRatio, amount, eraser } =
      useControls({
        blockWidth: {
          value: 10,
          min: 4,
          max: 50,
          step: 0.1,
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
        amount: {
          value: 100,
          min: 1,
          max: 1000,
          step: 1,
        },
        eraser: true,
      });

    function changeVisibility(e) {
      if (eraser) {
        e.target.style.cursor = "not-allowed";
        e.target.style.opacity = 0;
      } else {
        e.target.style.cursor = "copy";
        e.target.style.opacity = 1;
      }
    }

    const blurryBlocks = [...Array(amount)].map((e, i) => (
      <div
        class={style.blurryblock}
        key={i}
        onPointerOver={changeVisibility}
        style={{
          width: blockWidth + "%",
          backdropFilter: "blur(" + blur + "px)",
          borderRadius: cornerRadius + "px",
          height: blockWidth / heightRatio + "%",
        }}
      />
    ));

    return (
      <div class={style.container}>
        <div>
          <div
            class={style.image}
            id="image"
            style={{
              background: "url(" + this.state.image + ") no-repeat",
              width: this.state.imageWidth + "px",
              height: this.state.imageHeight + "px",
            }}
          >
            {this.state.image ? blurryBlocks : ""}
          </div>
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
