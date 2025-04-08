const axios = require('axios');
const cheerio = require('cheerio');
const XLSX = require('xlsx');

const url = 'https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35';

async function scrapeJobs() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const jobs = [];

    $('.clearfix .job-bx').each((i, el) => {
      const jobPosted = $(el).find('span.sim-posted span').text().trim();
      const title = $(el).find('header h2 a').text().trim();
      const company = $(el).find('.joblist-comp-name').text().trim();
      const location = $(el).find('.top-jd-dtl li').eq(0).text().trim();
      const salary = $(el).find('.top-jd-dtl li').eq(2).text().trim();
      const description = $(el).find('.list-job-dtl li').first().text().trim();

      jobs.push({
        'Job Title': title,
        'Company Name': company,
        'Location': location,
        'Posted Date': jobPosted,
        'Job Description': description,
        'Salary': salary
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(jobs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs');
    XLSX.writeFile(workbook, 'jobs_data.xlsx');

    console.log('Data Scraapped Successfully!');
  } catch (error) {
    console.error('Error: ', error.message);
  }
}

scrapeJobs();
