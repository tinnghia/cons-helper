import "./AppStyles.css";

import { Cards } from "./Cards";
import { CategoryList } from "./CategoryList";

export default function Home() {
    const onChangeCategory = (categoryCode: string) => {

    }
    return (
        <>
            <CategoryList onChange={onChangeCategory} />
            <div>
                <Cards />
            </div>
        </>
    );
}
