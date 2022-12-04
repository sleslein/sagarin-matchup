import Card from "../components/Card.tsx";
import PageLayout from "../components/PageLayout.tsx";
import { Link } from "../components/Link.tsx";

export default function About() {
    return (
        <PageLayout activePage="about">
            <Card className="max-w-md mx-auto">
                <h1 class="hidden">About!</h1>
                <Paragraph>
                    For years Jeff Sagarin's NFL ratings have been a staple for predicting the outcomes of NFL games. Simplicity is one of the rating systems greatest features. Using the system is a simple as subtracting the away team's rating from the total of the home team's rating plus the home field advantage value.
                </Paragraph>
                <Paragraph>
                    For example, if the home field advatnage is 2 points and home team's rating is 25, their total rating would be 27. If the away team's rating is 24, then the home team would be favored by 3.
                </Paragraph>
                <Paragraph>
                    This site automatically compares the current week's Sagarin Ratings agains the selected weeks NFL schedule.  Winners are highlighted and the games are sorted by predicted margin of victory.  
                </Paragraph>
                <Paragraph>
                    All of the Sagarin Ratings can be found <Link href="https://sagarin.usatoday.com/2022-2/nfl-team-ratings-2022/">here</Link>.
                </Paragraph>
            </Card>
        </PageLayout>
    );
  }

  function Paragraph({ children }) {
    return <p class="mb-4 last:mb-0">{children}</p>
  }