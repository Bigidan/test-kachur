import Image from "next/image";

const NotFoundK = () => {
    return (
        <div className="w-full h-full">
            <div className="flex flex-col justify-center items-center text-center">
                <Image src="/something_wrong.webp" alt="Упс" width={400} height={400} />
                <h1 className="text-2xl p-4">Йойк! За цим посиланням нічого не знайдено...</h1>
                <h4 className="text-sm">Каченякто <span className="gradient-wave">пропонує скористатися пошуком</span>,
                    так можна легко знайти потрібний матеріал</h4>
            </div>
        </div>
    )
}

export default NotFoundK;