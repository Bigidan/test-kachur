
import PopularityPage from "@/app/(auth)/(protected)/admin/character/popularity";
import CharacterList from "@/app/(auth)/(protected)/admin/character/character-list";

export default function CharacterPage() {
    return (
        <div className="grid grid-cols-5">
            <div className="col-span-3">
                <CharacterList />
            </div>
            <div className="col-span-2">
                <PopularityPage />
            </div>
        </div>
    );
}