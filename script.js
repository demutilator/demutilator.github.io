document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('image-upload');
    const uploadBtn = document.getElementById('upload-btn');
    const fileCount = document.getElementById('file-count');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const collageContainer = document.getElementById('collage-container');
    
    const layoutSelect = document.getElementById('layout');
    const columnsInput = document.getElementById('columns');
    const spacingInput = document.getElementById('spacing');
    const bgColorInput = document.getElementById('bg-color');
    
    let uploadedImages = [];
    
    // Upload images
    uploadBtn.addEventListener('click', function() {
        imageUpload.click();
    });

    
    
    imageUpload.addEventListener('change', function(e) {
        const files = e.target.files;
        
        if (files.length > 0) {
            fileCount.textContent = `${files.length} image(s) selected`;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.match('image.*')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        addImageToUploads(e.target.result);
                    };
                    
                    reader.readAsDataURL(file);
                }
            }
        } else {
            fileCount.textContent = '0 images selected';
        }
    });
    
    function addImageToUploads(imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        
        // Create thumbnail wrapper
        const thumbnailWrapper = document.createElement('div');
        thumbnailWrapper.className = 'thumbnail-wrapper';
        
        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-thumbnail';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', function() {
            removeImage(imageSrc);
            thumbnailWrapper.remove();
        });
        
        // Set up thumbnail image
        img.className = 'thumbnail';
        thumbnailWrapper.appendChild(img);
        thumbnailWrapper.appendChild(removeBtn);
        thumbnailContainer.appendChild(thumbnailWrapper);
        
        // Add to uploaded images array
        uploadedImages.push({
            src: imageSrc,
            element: thumbnailWrapper
        });
        
        updateFileCount();
    }
    
    function removeImage(imageSrc) {
        uploadedImages = uploadedImages.filter(img => img.src !== imageSrc);
        updateFileCount();
        
        // If collage is already generated, regenerate it
        if (collageContainer.children.length > 0) {
            generateBtn.click();
        }
    }
    
    function updateFileCount() {
        fileCount.textContent = `${uploadedImages.length} image(s) uploaded`;
    }
    
    // Clear all images
    clearAllBtn.addEventListener('click', function() {
        uploadedImages = [];
        thumbnailContainer.innerHTML = '';
        collageContainer.innerHTML = '';
        updateFileCount();
    });
    
    // Generate collage
    generateBtn.addEventListener('click', function() {
        if (uploadedImages.length === 0) {
            alert('Please upload some images first!');
            return;
        }
        
        // Clear previous collage
        collageContainer.innerHTML = '';
        collageContainer.style.backgroundColor = bgColorInput.value;
        
        const layout = layoutSelect.value;
        const columns = parseInt(columnsInput.value);
        const spacing = parseInt(spacingInput.value);
        
        // Set CSS variables for layout
        collageContainer.style.setProperty('--columns', columns);
        collageContainer.style.setProperty('--spacing', `${spacing}px`);
        
        // Create collage based on selected layout
        switch (layout) {
            case 'grid':
                createGridCollage(columns, spacing);
                break;
            case 'masonry':
                createMasonryCollage(columns, spacing);
                break;
            case 'puzzle':
                createPuzzleCollage(spacing);
                break;
        }
    });
    
    function createGridCollage(columns, spacing) {
        collageContainer.className = 'grid-layout';
        collageContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        uploadedImages.forEach(imgData => {
            const img = document.createElement('img');
            img.src = imgData.src;
            img.className = 'collage-image';
            img.style.width = `calc((100% - ${(columns - 1) * spacing}px) / ${columns})`;
            collageContainer.appendChild(img);
        });
    }
    
    function createMasonryCollage(columns, spacing) {
        collageContainer.className = 'masonry-layout';
        
        uploadedImages.forEach(imgData => {
            const img = document.createElement('img');
            img.src = imgData.src;
            img.className = 'collage-image';
            collageContainer.appendChild(img);
        });
    }
    
    function createPuzzleCollage(spacing) {
        collageContainer.className = 'puzzle-layout';
        collageContainer.style.position = 'relative';
        
        const containerWidth = collageContainer.clientWidth;
        const containerHeight = collageContainer.clientHeight;
        
        uploadedImages.forEach((imgData, index) => {
            const img = document.createElement('img');
            img.src = imgData.src;
            img.className = 'collage-image';
            
            // Random size between 30% and 70% of container
            const width = Math.random() * 0.4 + 0.3;
            img.style.width = `${width * 100}%`;
            
            // Random position within container
            const left = Math.random() * (1 - width) * 100;
            const top = Math.random() * (1 - (width * 0.75)) * 100;
            
            img.style.left = `${left}%`;
            img.style.top = `${top}%`;
            
            // Random rotation between -15 and 15 degrees
            const rotation = (Math.random() * 30) - 15;
            img.style.transform = `rotate(${rotation}deg)`;
            
            collageContainer.appendChild(img);
        });
    }
    
    // Download collage
    downloadBtn.addEventListener('click', function() {
        if (collageContainer.children.length === 0) {
            alert('Please generate a collage first!');
            return;
        }
        
        html2canvas(collageContainer).then(canvas => {
            const link = document.createElement('a');
            link.download = 'collage.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});