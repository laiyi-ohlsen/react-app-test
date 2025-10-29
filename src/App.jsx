import "./App.css"; // imports our styles 
import { useState, useRef } from "react"; // import the useState React Hook
import html2canvas from 'html2canvas'; 
const base = import.meta.env.BASE_URL


// define my images array in their initial order
const initialImages = [
  { id: 1, url: `${base}images/1.jpg`, title: "One"},
  {id: 2, url: `${base}images/2.png`, title: "Two"},
  {id: 3, url: `${base}images/3.jpg`, title: "Three"}, 
]

// defining Gallery component
export default function Gallery(){
  // setting up state getters and setters
  
  // images lets us read the state, setImages lets us chnage the state
  const [images, setImages] = useState(initialImages); 

  // draggedId lets us read the id of whatever image is being dragged
  // setDraggedId lets us change the id to be whatever image is being dragged
  const [draggedId, setDraggedId] = useState(null);

  // hoveredId lets us read what image is being hovered over 
  // setHoveredId lets us change the id to be whatever image is being hovered over
  const [hoveredId, setHoveredId] = useState(null);

  const galleryRef = useRef(null); 
    console.log(galleryRef)
  
  // custom function to update the draggedId state variable with the dragged image id
  const handleDragStart = (id) => setDraggedId(id); 

  // custom function to switch the images when the dragged image is dropped
  const handleDrop = (targetId) => {

    // if the image being dragged is hovering over the same place
    if (draggedId === targetId) return;

    // finding the index of the image that is being dragged 
    const draggedIndex = images.findIndex(i => i.id === draggedId);

     // finding the index of the image that is being hovered over
    const targetIndex = images.findIndex(i => i.id === targetId); 

    // make a copy of our images in their current state
    const newImages = [...images];

    // cutting the dragged image out of the copy of the images array
    const [moved] = newImages.splice(draggedIndex, 1);

    // putting the image in its new spot in the copy of the images array
    newImages.splice(targetIndex, 0, moved);

    // use the setter state function to update the images state array
    setImages(newImages);

    // set dragged Id and hover Id back to null becuase nothing is being hovered over or dragged
    setDraggedId(null);
    setHoveredId(null)
  }; 

  const handleUpload = (e) => {
    // getting the files and putting them into an array
    const files = Array.from(e.target.files);
    
    // setting same info pre loaded images have 
    const newImages = files.map((file,index) => ({
      id: Date.now() + index, 
      url: URL.createObjectURL(file),
      title: file.name, 
    }))
    console.log(newImages)

    //updating the state of the images to include upload images
    setImages([...images, ...newImages])
  } 

  const downloadGallery = async () => {
    console.log(galleryRef)
    // checking if gallery is loaded properly in DOM (error preventing)
    if(!galleryRef.current) return;
      


    // creating a canvas element that we can download <canvas>
    const canvas = await html2canvas(galleryRef.current, { useCORS: true})

    // convert the canvas into png url
    const dataURL = canvas.toDataURL("image/png"); 

    // trigger a download
    const link = document.createElement("a"); 
    console.log(link)
    link.href = dataURL; 
    link.download = "gallery.png";
    link.click(); 
  }

  return(
    <div>
      <input type ="file"
      multiple
      onChange = {handleUpload}
      />
    <button onClick={downloadGallery}>
      Download Gallery
    </button>

    <div className = "gallery" ref={galleryRef}>
      {images.map(img => (
        < div 
        key = {img.id}
        draggable
        onDragStart = {() => handleDragStart(img.id)}
        onDragOver = {(e) => {
          e.preventDefault();
          setHoveredId(img.id)
        }}
        onDragLeave ={() => setHoveredId(null)}
        onDrop = {() => handleDrop(img.id)}
        className = {`gallery-item ${draggedId == img.id ? "dragged" : ""} 
        ${hoveredId == img.id && draggedId != img.id ? "hovered" : ""}`}
        >
          <img src={img.url} alt={img.title}/>
        </div>
      ))}

    </div>
    </div>
  )

}