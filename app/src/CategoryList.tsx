import { FunctionComponent, useContext, useEffect, useState } from "react";
import { CategoryContext } from "./Context";
import { CategoryType } from "./models/Category";
import appConfig from './config/config.json';
import axios from "axios";

interface CategoryListProps {
    onChange: (categoryCode: string) => void;
}
export const CategoryList: FunctionComponent<CategoryListProps> = ({ onChange }) => {
    const [categoriesData, setCategoriesData] = useState([]);
    const { category, setCategory } = useContext(CategoryContext);

    useEffect(() => {
        const url = `${appConfig.backendUrl}/api/categories`;
        axios.get(url)
            .then((response) => {
                setCategoriesData(response.data);
            });
    }, []);

    const handleClick = (event: any, category: string) => {
        event.preventDefault();
        setCategory(category);
        onChange(category);
    }

    return (
        <div className="scrollmenu">
            {
                categoriesData && categoriesData.map((categoryItem: CategoryType) =>
                    <a className={`categoryCls ${categoryItem.code === category ? "active" : ""}`} onClick={e => handleClick(e, categoryItem.code)} key={categoryItem.code}>{categoryItem.description}</a>
                )
            }
        </div>

    );
}
