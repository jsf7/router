export const autoLink = function (datasetAttribute = 'link') {
    document.addEventListener('click', e => {
        let target = e.target;
        while (target) {
            if(target.dataset[datasetAttribute]) {
                setPath(target.dataset[datasetAttribute]);
                e.preventDefault();
                break;
            }
            target = target.parentNode;
        }
    });

    document.addEventListener('keypress', e => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            let target = e.target;
            while (target) {
                if(target.dataset.link) {
                    setPath(target.dataset.link);
                    e.preventDefault();
                    break;
                }
                target = target.parentNode;
            }
        }
    });

}