import {ChangeEvent, useEffect, useState} from 'react'
import './App.css'
import axios from "axios";

interface IFetch {
    href: "",
    method: "",
    operation_id: "",
    templated: false
}

function App() {
    const urlFetch = "https://cloud-api.yandex.net/v1/disk/resources/upload?path="

    const [loaderFile, setLoaderFile] = useState<File[]>([])
    const [error, setError] = useState<string>("")
    const [url, setUrl] = useState<IFetch[]>([])

    const upLoaderMediaFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;

        if (file) {
            if (file.length) {
                setLoaderFile(prevState => prevState.concat(Array.from(file)))
            }
        }
    }

    const resetListFiles = () => {
        setLoaderFile([])
        setUrl([])
    }

    useEffect(() => {
        loaderFile.length > 100 ? setError("Не более 100") : setError("")
    }, [loaderFile])

    useEffect(() => {
        const fetchUploaderUrl = async (i: string) => {
            const headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "OAuth y0_AgAAAABcJYNIAADLWwAAAADpHzPbcu2ts7mzQ4ecBo64U1Z6L6Oqkfk",
            }

            const res = await axios(`${urlFetch}${i}`, {
                method: "GET",
                headers: headers
            })

            return setUrl([...url, res.data])

        }
        if (loaderFile.length !== url.length) {
            loaderFile.forEach(el => {
                setTimeout(() => {
                    void fetchUploaderUrl(el.name)
                }, 1000)
            })
        }


    }, [url.length, loaderFile])


    const fetchUploader = () => {

        loaderFile.forEach((el, i) => {
            setTimeout(() => {
                void axios(url.filter((_, j) => j === i)[0].href, {method: "PUT", data: el})
            }, 500)
        })
    }

    return (
        <>
            <div>
                <div>ЗАГРУЗКА ФАЙЛОВ НА ЯНДЕКС.ДИСК</div>
                <span>{url.length && url.length === loaderFile.length ? "ГОТОВО": "ИДЕТ ПОЛУЧЕНИЕ ДАННЫХ"}</span>
                <div>
                    <div>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => upLoaderMediaFile(e)}/>
                        <span>Количество файлов: {loaderFile.length}</span>
                    </div>
                    <span>{error}</span>
                </div>

            </div>
            <button disabled={!loaderFile.length} onClick={fetchUploader}>Загрузить</button>
            <button disabled={loaderFile.length === 0} onClick={resetListFiles}>Очистить</button>
        </>
    )
}

export default App
