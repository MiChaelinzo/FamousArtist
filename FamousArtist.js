import { createLens } from 'snapkit';
import * as cv from 'opencv4nodejs';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const video = document.createElement('video');

// Set up the camera view
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();
});

// Set up the art style buttons
const styles = ['Van Gogh', 'Monet', 'Picasso', 'Warhol'];
const buttons = [];

for (let i = 0; i < styles.length; i++) {
  buttons[i] = document.createElement('button');
  buttons[i].innerHTML = styles[i];
  document.body.appendChild(buttons[i]);
}

// Set up the art style transformation functionality
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Use OpenCV to detect the features of the user's face
    const frame = cv.imdecode(new cv.Mat(video.height, video.width, cv.CV_8UC4, video.src));
    const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    const { objects } = classifier.detectMultiScale(frame.bgrToGray());
    frame.delete();

    if (objects.length > 0) {
      // Draw the video frame onto the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Overlay the selected art style onto the user's face
      if (index === 0) {
        // Van Gogh
        ctx.drawImage('https://sothebys-com.brightspotcdn.com/dims4/default/4fe8a62/2147483647/strip/true/crop/2356x2861+0+0/resize/684x831!/format/webp/quality/90/?url=http%3A%2F%2Fsothebys-brightspot.s3.amazonaws.com%2Fdotcom%2Ff8%2Fb6%2F87cea0c04020b03b05e450c3aa4d%2Fself-portrait-with-a-bandaged-ear-vincent-van-gogh.jpg', objects[0].x, objects[0].y, objects[0].width, objects[0].height);
      } else if (index === 1) {
        // Monet
        ctx.drawImage('https://artlogic-res.cloudinary.com/w_2000,h_1600,c_limit,f_auto,fl_lossy,q_auto:good/ws-halcyon/usr/exhibitions/images/feature_panels/326/cmo-oil-lan-82215-2-.jpg', objects[0].x, objects[0].y, objects[0].width, objects[0].height);
      } else if (index === 2) {
        // Picasso
        ctx.drawImage('https://sothebys-com.brightspotcdn.com/dims4/default/52545b5/2147483647/strip/true/crop/450x536+0+0/resize/684x815!/format/webp/quality/90/?url=http%3A%2F%2Fsothebys-brightspot-migration.s3.amazonaws.com%2F20%2F3f%2Fe0%2F337d3e01f64e8fd933fb212088a00aef806fc9f0a9ec8e0223e0f3bb27%2Fpicasso-announcement-1.jpg', objects[0].x, objects[0].y, objects[0].width, objects[0].height);
      } else if (index === 3) {
        // Warhol
        ctx.drawImage('https://news.artnet.com/app/news-upload/2022/03/Warhol-Marilyn-1024x1017.jpg', objects[0].x, objects[0].y, objects[0].width, objects[0].height);
      }
    }
  });
});

// Create the snap lens
createLens({
  canvas,
  render() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  },
});



