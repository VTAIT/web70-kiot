const formatDate = (format) => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (day < 10) {
        day = `0${day}`;
    }

    if (month < 10) {
        month = `0${month}`;
    }

    switch (format) {
        case 'DD-MM-YYYY':return `${day}-${month}-${year}`;
        case 'YYYY-MM-DD':return `${year}-${month}-${day}`;
        default: return date;
    }
    
}

export { formatDate };