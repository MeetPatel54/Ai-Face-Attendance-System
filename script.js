// The link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/FlHovBDAjZ/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// Function to mark attendance
function markAttendance() {
    const predictions = labelContainer.innerText.split('\n');
    const highestProbability = predictions.reduce((max, prediction) => {
        const [, probability] = prediction.split(': ');
        return Math.max(max, parseFloat(probability));
    }, 0);

    const recognizedPerson = predictions.find(prediction => {
        const [, probability] = prediction.split(': ');
        return parseFloat(probability) === highestProbability;
    });

    if (recognizedPerson && highestProbability > 0.8) {
        const [name] = recognizedPerson.split(': ');
        const attendanceList = document.getElementById('attendanceList');
        const listItem = document.createElement('div');
        listItem.textContent = `${name} - ${new Date().toLocaleString()}`;
        listItem.style.opacity = '0';
        listItem.style.transform = 'translateY(20px)';
        attendanceList.appendChild(listItem);

        // Animate the new list item
        setTimeout(() => {
            listItem.style.transition = 'all 0.5s ease-out';
            listItem.style.opacity = '1';
            listItem.style.transform = 'translateY(0)';
        }, 10);
    } else {
        alert('No person recognized with high confidence. Please try again.');
    }
}

// Initialize the system
init();

// Add event listener to the Mark Attendance button
document.getElementById('markAttendance').addEventListener('click', markAttendance);

// Create particle effect
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.transform = `scale(${Math.random()})`;
        particle.style.opacity = Math.random();
        particlesContainer.appendChild(particle);

        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const animation = particle.animate(
        [
            { transform: 'translate(0, 0)', opacity: Math.random() },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`, opacity: 0 }
        ],
        {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
            iterations: Infinity
        }
    );

    animation.onfinish = () => {
        particle.remove();
        createParticle();
    };
}

// Start creating particles
createParticles();

