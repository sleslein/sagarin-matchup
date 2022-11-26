import Card from "../components/Card.tsx";
import PageLayout from "../components/PageLayout.tsx";

export default function About() {
    return (
        <PageLayout activePage="about">
            <Card className="max-w-md mx-auto">
                <h1>About!</h1>
                <a target="_" href="https://sagarin.usatoday.com/2022-2/nfl-team-ratings-2022/">USA Today Ratings</a>
            </Card>
        </PageLayout>
    );
  }