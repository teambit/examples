import { renderTemplate } from '@teambit/html.modules.render-template';
    import { DemoHtml } from './index';
    
    it('should render with the correct text', () => {
      const testString = "test string";
      const element = DemoHtml({ text: testString });
      const body = document.body;
      renderTemplate(body, element);
      const renderedElement = [...document.getElementsByTagName("div")].find(el => el.textContent === testString);
      expect(renderedElement).toBeTruthy();
    });
