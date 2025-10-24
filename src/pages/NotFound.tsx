import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import { useI18n } from '@/lib/i18n';

const NotFound = () => {
  const navigate = useNavigate();
  const randomImageIndex = Math.floor(Math.random() * 7); // Picks a number between 0 and 6
  const backgroundImageUrl = `/404_${randomImageIndex}.png`;

  const { t } = useI18n();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-6 relative"
      style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
    >
      <div className="absolute inset-0 -z-10 bg-black opacity-60"></div>
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('404_1.jpg')" }}
      ></div>

  <div className="flex flex-col space-y-10 items-center relative z-10 text-foreground dark:text-white text-center">
        {/* <Frown className="w-24 h-24 text-primary mb-4" /> */}
        <h1 className="text-[8rem] mb-20 md:text-[10rem] font-bold text-foreground dark:text-white drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
          404
        </h1>
        <p className="text-[1rem] font-medium mb-10 md:text-[1.5rem] text-foreground dark:text-white drop-shadow-[0_2px_6px_rgba(0,0,0,1)] max-w-5xl">
          ⚡ Uh-oh! Your EEG signals have drifted into the neural abyss 🧠💥. We
          scanned every neuron but couldn't find this page. Maybe it's lost in
          deep learning? 🤖✨
        </p>
        <Button
          onClick={() => navigate("/")}
          className="px-6 py-3 text-lg bg-primary text-white hover:bg-primary-dark"
        >
          {t('notfound.return')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;